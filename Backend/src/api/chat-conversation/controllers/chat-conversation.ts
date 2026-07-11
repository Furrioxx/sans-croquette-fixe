import { factories } from '@strapi/strapi'
import { getRoleName } from '../../../utils/absence-delegation'

type AuthUser = {
  id: number
  role?: { name?: string | null } | null
}

const CONVERSATION_UID = 'api::chat-conversation.chat-conversation' as any
const MESSAGE_UID = 'api::chat-message.chat-message' as any
const CAT_SHEET_UID = 'api::cat-sheet.cat-sheet' as any
const MAX_MESSAGE_LENGTH = 2000

const CONVERSATION_POPULATE = {
  requester: {
    fields: ['username'],
  },
  catSheet: {
    populate: {
      cats: {
        fields: ['name'],
      },
      linkedVolunteer: {
        fields: ['username'],
      },
      backupVolunteer: {
        fields: ['username'],
      },
    },
  },
  messages: {
    sort: ['createdAt:asc'],
    populate: {
      author: {
        fields: ['username'],
        populate: {
          role: {
            fields: ['name'],
          },
        },
      },
    },
  },
}

const getMessageContent = (body: unknown) => {
  const payload = (body as any)?.data ?? body
  const content = typeof (payload as any)?.content === 'string' ? (payload as any).content.trim() : ''

  if (!content || content.length > MAX_MESSAGE_LENGTH) {
    return null
  }

  return content
}

const getConversation = async (strapi: any, documentId: string) => {
  return await strapi.documents(CONVERSATION_UID).findOne({
    documentId,
    populate: CONVERSATION_POPULATE as any,
  })
}

const canAccessConversation = (conversation: any, userId: number, roleName: string | null) => {
  if (roleName === 'Admin') {
    return true
  }

  if (roleName === 'User') {
    return conversation.requester?.id === userId
  }

  if (roleName === 'Volunteer') {
    return (
      conversation.catSheet?.linkedVolunteer?.id === userId ||
      conversation.catSheet?.backupVolunteer?.id === userId
    )
  }

  return false
}

export default factories.createCoreController(CONVERSATION_UID, ({ strapi }) => ({
  async find(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)
    const catSheetDocumentId =
      typeof ctx.query?.catSheetDocumentId === 'string' ? ctx.query.catSheetDocumentId : null

    if (!['User', 'Volunteer', 'Admin'].includes(roleName ?? '')) {
      return ctx.forbidden('You are not allowed to access conversations')
    }

    const filters: Record<string, unknown> = {}

    if (roleName === 'User') {
      filters.requester = { id: { $eq: user.id } }
      if (catSheetDocumentId) {
        filters.catSheet = { documentId: { $eq: catSheetDocumentId } }
      }
    } else if (roleName === 'Volunteer') {
      filters.$or = [
        { catSheet: { linkedVolunteer: { id: { $eq: user.id } } } },
        { catSheet: { backupVolunteer: { id: { $eq: user.id } } } },
      ]
    }

    const conversations = await strapi.documents(CONVERSATION_UID).findMany({
      filters,
      populate: CONVERSATION_POPULATE as any,
      sort: ['lastMessageAt:desc'],
    })

    return { data: conversations }
  },

  async findOne(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const conversation = await getConversation(strapi, ctx.params.id)

    if (!conversation) {
      return ctx.notFound('Conversation not found')
    }

    const roleName = await getRoleName(strapi, user)

    if (!canAccessConversation(conversation, user.id, roleName)) {
      return ctx.forbidden('You are not allowed to access this conversation')
    }

    return { data: conversation }
  },

  async create(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'User') {
      return ctx.forbidden('Only users can start a conversation')
    }

    const payload = (ctx.request.body as any)?.data ?? ctx.request.body
    const catSheetDocumentId =
      typeof payload?.catSheetDocumentId === 'string' ? payload.catSheetDocumentId : ''
    const content = getMessageContent(ctx.request.body)

    if (!catSheetDocumentId) {
      return ctx.badRequest('Cat sheet document id is required')
    }

    if (!content) {
      return ctx.badRequest(`Message content must contain between 1 and ${MAX_MESSAGE_LENGTH} characters`)
    }

    const catSheet = await strapi.documents(CAT_SHEET_UID).findOne({
      documentId: catSheetDocumentId,
      status: 'published',
    })

    if (!catSheet) {
      return ctx.notFound('Cat sheet not found')
    }

    const existingConversations = await strapi.documents(CONVERSATION_UID).findMany({
      filters: {
        requester: { id: { $eq: user.id } },
        catSheet: { documentId: { $eq: catSheetDocumentId } },
      },
      limit: 1,
    })

    if (existingConversations.length > 0) {
      return ctx.conflict('A conversation already exists for this cat sheet')
    }

    const conversation = await strapi.documents(CONVERSATION_UID).create({
      data: {
        catSheet: catSheetDocumentId,
        requester: user.id,
        lastMessageAt: new Date().toISOString(),
      } as any,
    })

    try {
      await strapi.documents(MESSAGE_UID).create({
        data: {
          content,
          conversation: conversation.documentId,
          author: user.id,
        } as any,
      })
    } catch (error) {
      await strapi.documents(CONVERSATION_UID).delete({
        documentId: conversation.documentId,
      })
      throw error
    }

    return { data: await getConversation(strapi, conversation.documentId) }
  },

  async sendMessage(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const content = getMessageContent(ctx.request.body)

    if (!content) {
      return ctx.badRequest(`Message content must contain between 1 and ${MAX_MESSAGE_LENGTH} characters`)
    }

    const conversation = await getConversation(strapi, ctx.params.id)

    if (!conversation) {
      return ctx.notFound('Conversation not found')
    }

    const roleName = await getRoleName(strapi, user)

    if (!canAccessConversation(conversation, user.id, roleName)) {
      return ctx.forbidden('You are not allowed to reply to this conversation')
    }

    await strapi.documents(MESSAGE_UID).create({
      data: {
        content,
        conversation: conversation.documentId,
        author: user.id,
      } as any,
    })

    await strapi.documents(CONVERSATION_UID).update({
      documentId: conversation.documentId,
      data: {
        lastMessageAt: new Date().toISOString(),
      } as any,
    })

    return { data: await getConversation(strapi, conversation.documentId) }
  },
}))
