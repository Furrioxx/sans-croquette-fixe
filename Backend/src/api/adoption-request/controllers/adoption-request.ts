import { factories } from '@strapi/strapi'
import { getRoleName } from '../../../utils/absence-delegation'
import {
  ADOPTION_REQUEST_POPULATE,
  getAdoptionRequestWithRelations,
  getAuthorizedCatSheetDocumentIds,
  sanitizeAdoptionRequestPayload,
} from '../../../utils/adoption-request'

type AuthUser = {
  id: number
  role?: {
    name?: string | null
  } | null
}

const ADOPTION_REQUEST_UID = 'api::adoption-request.adoption-request' as any

export default factories.createCoreController(ADOPTION_REQUEST_UID, ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const body = ctx.request.body as any
    const payload = sanitizeAdoptionRequestPayload((body?.data || body) as Record<string, unknown>)
    if (!payload.catSheet || typeof payload.catSheet !== 'string') {
      return ctx.badRequest('Cat sheet document id is required')
    }

    const catSheet = await strapi.documents('api::cat-sheet.cat-sheet').findOne({
      documentId: payload.catSheet,
      status: 'draft',
    })

    if (!catSheet) {
      return ctx.notFound('Cat sheet not found')
    }

    const createdRequest = await strapi.documents(ADOPTION_REQUEST_UID).create({
      status: 'draft',
      populate: ADOPTION_REQUEST_POPULATE as any,
      data: {
        ...payload,
        processingStatus: payload.processingStatus ?? 'pending',
        catSheet: catSheet.documentId,
        submittedBy: user.id,
      } as any,
    })

    return { data: createdRequest }
  },

  async find(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)
    const baseFilters = ((ctx.query?.filters as Record<string, unknown> | undefined) ?? {})
    const authorizedCatSheetIds = await getAuthorizedCatSheetDocumentIds(strapi, user)

    if (roleName !== 'Admin' && authorizedCatSheetIds.length === 0) {
      return { data: [] }
    }

    const filters =
      roleName === 'Admin'
        ? baseFilters
        : {
            ...baseFilters,
            catSheet: {
              documentId: {
                $in: authorizedCatSheetIds,
              },
            },
          }

    const data = await strapi.documents(ADOPTION_REQUEST_UID).findMany({
      status: 'draft',
      filters,
      populate: ADOPTION_REQUEST_POPULATE as any,
      sort: {
        createdAt: 'desc',
      } as any,
    })

    return { data }
  },

  async findOne(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const entity = await getAdoptionRequestWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Adoption request not found')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      const authorizedCatSheetIds = await getAuthorizedCatSheetDocumentIds(strapi, user)

      if (!entity.catSheet?.documentId || !authorizedCatSheetIds.includes(entity.catSheet.documentId)) {
        return ctx.forbidden('You are not allowed to access this adoption request')
      }
    }

    return { data: entity }
  },

  async update(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const entity = await getAdoptionRequestWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Adoption request not found')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      const authorizedCatSheetIds = await getAuthorizedCatSheetDocumentIds(strapi, user)

      if (!entity.catSheet?.documentId || !authorizedCatSheetIds.includes(entity.catSheet.documentId)) {
        return ctx.forbidden('You are not allowed to update this adoption request')
      }
    }

    const body = ctx.request.body as any
    const payload = sanitizeAdoptionRequestPayload((body?.data || body) as Record<string, unknown>)

    await strapi.documents(ADOPTION_REQUEST_UID).update({
      documentId: ctx.params.id,
      populate: ADOPTION_REQUEST_POPULATE as any,
      data: {
        ...payload,
        catSheet: entity.catSheet?.documentId,
        submittedBy: entity.submittedBy?.id,
      } as any,
    })

    return { data: await getAdoptionRequestWithRelations(strapi, ctx.params.id) }
  },

  async delete(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const entity = await getAdoptionRequestWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Adoption request not found')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      const authorizedCatSheetIds = await getAuthorizedCatSheetDocumentIds(strapi, user)

      if (!entity.catSheet?.documentId || !authorizedCatSheetIds.includes(entity.catSheet.documentId)) {
        return ctx.forbidden('You are not allowed to delete this adoption request')
      }
    }

    await strapi.documents(ADOPTION_REQUEST_UID).delete({
      documentId: ctx.params.id,
    })

    return { data: entity }
  },
}))
