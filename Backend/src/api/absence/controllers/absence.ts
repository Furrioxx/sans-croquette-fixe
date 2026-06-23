/**
 * absence controller
 */

import { factories } from '@strapi/strapi'

type AuthUser = {
  id: number
  role?: {
    name?: string | null
  } | null
}

type UserWithRole = {
  id: number
  role?: {
    name?: string | null
  } | null
}

const getFullUser = async (strapi: any, userId: number): Promise<UserWithRole | null> => {
  return await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: { role: true },
  })
}

const getRoleName = async (strapi: any, user: AuthUser | null | undefined) => {
  if (!user) {
    return null
  }

  if (user.role?.name) {
    return user.role.name
  }

  const fullUser = await getFullUser(strapi, user.id)

  return fullUser?.role?.name ?? null
}

const getDateError = (payload: { startDate?: string | null; endDate?: string | null }) => {
  if (!payload.startDate) {
    return 'Start date is required'
  }

  if (!payload.endDate) {
    return 'End date is required'
  }

  const startDate = new Date(payload.startDate)
  const endDate = new Date(payload.endDate)

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return 'Invalid absence dates'
  }

  if (endDate < startDate) {
    return 'End date must be after start date'
  }

  return null
}

const hasOverlappingAbsence = async (
  strapi: any,
  userId: number,
  startDate: string,
  endDate: string,
) => {
  const existingAbsence = await strapi.db.query('api::absence.absence').findOne({
    where: {
      user: userId,
      absence_status: {
        $ne: 'rejected',
      },
      startDate: {
        $lte: endDate,
      },
      endDate: {
        $gte: startDate,
      },
    },
  })

  return !!existingAbsence
}

export default factories.createCoreController('api::absence.absence', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const body = ctx.request.body as any
    const roleName = await getRoleName(strapi, user)
    const payload = (body?.data || body) as any
    const dateError = getDateError(payload)
    let targetUserId = user.id

    if (dateError) {
      return ctx.badRequest(dateError)
    }

    if (roleName === 'Admin' && payload?.user) {
      const targetUser = await getFullUser(strapi, payload.user)

      if (!targetUser || targetUser.role?.name !== 'Volunteer') {
        return ctx.badRequest('Selected user must be a volunteer')
      }

      targetUserId = targetUser.id
    }

    const overlappingAbsence = await hasOverlappingAbsence(
      strapi,
      targetUserId,
      payload.startDate,
      payload.endDate,
    )

    if (overlappingAbsence) {
      return ctx.badRequest('This volunteer already has an absence during this period')
    }

    ctx.request.body = {
      ...body,
      data: {
        ...payload,
        user: targetUserId,
      },
    }

    // @ts-ignore - "super" est injecte par Strapi dans ce contexte
    return await super.create(ctx)
  },

  async find(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      const query = (ctx.query || {}) as any
      const existingFilters = (query.filters || {}) as any

      ctx.query = {
        ...query,
        filters: {
          ...existingFilters,
          user: user.id,
        },
      }
    }

    // @ts-ignore - "super" est injecte par Strapi dans ce contexte
    return await super.find(ctx)
  },

  async findOne(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      const entity = await strapi.db.query('api::absence.absence').findOne({
        where: { documentId: ctx.params.id },
        populate: { user: true },
      })

      if (!entity || entity.user?.id !== user.id) {
        return ctx.forbidden('You are not allowed to access this absence')
      }
    }

    // @ts-ignore - "super" est injecte par Strapi dans ce contexte
    return await super.findOne(ctx)
  },
}))
