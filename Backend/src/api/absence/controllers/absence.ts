/**
 * absence controller
 */

import { factories } from '@strapi/strapi'
import {
  canUserManageAbsences,
  getFullUser,
  getRoleName,
} from '../../../utils/absence-delegation'

type AuthUser = {
  id: number
  role?: {
    name?: string | null
  } | null
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
    const delegateUserId = payload?.delegateUserId
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

    if (roleName === 'Admin' && !payload?.user && delegateUserId) {
      const delegateUser = await getFullUser(strapi, delegateUserId)

      if (
        !delegateUser ||
        delegateUser.role?.name !== 'Volunteer' ||
        delegateUser.confirmed !== true ||
        delegateUser.blocked === true
      ) {
        return ctx.badRequest('Selected delegate must be an active volunteer')
      }
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
        absence_status: payload.absence_status ?? (roleName === 'Admin' && !payload?.user ? 'approved' : 'pending'),
        user: targetUserId,
      },
    }

    // @ts-ignore - "super" est injecte par Strapi dans ce contexte
    const createdAbsence = await super.create(ctx)

    if (roleName === 'Admin' && !payload?.user && delegateUserId) {
      await strapi.db.query('api::absence-delegation.absence-delegation').create({
        data: {
          startDate: payload.startDate,
          endDate: payload.endDate,
          adminUser: user.id,
          delegateUser: delegateUserId,
          isActive: true,
          sourceAbsenceDocumentId: createdAbsence?.data?.documentId,
        },
      })
    }

    return createdAbsence
  },

  async find(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const { canManage } = await canUserManageAbsences(strapi, user)

    if (!canManage) {
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

    const { canManage } = await canUserManageAbsences(strapi, user)

    if (!canManage) {
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

  async update(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const { canManage, roleName } = await canUserManageAbsences(strapi, user)

    if (!canManage) {
      return ctx.forbidden('You are not allowed to update absences')
    }

    if (roleName !== 'Admin') {
      const payload = ((ctx.request.body as any)?.data || ctx.request.body || {}) as any
      const allowedStatuses = ['pending', 'approved', 'rejected']

      if (
        Object.keys(payload).some((key) => key !== 'absence_status') ||
        !allowedStatuses.includes(payload.absence_status)
      ) {
        return ctx.forbidden('You are only allowed to update absence status')
      }

      const entity = await strapi.db.query('api::absence.absence').findOne({
        where: { documentId: ctx.params.id },
        populate: {
          user: {
            populate: {
              role: true,
            },
          },
        },
      })

      if (!entity || entity.user?.role?.name !== 'Volunteer') {
        return ctx.forbidden('You are not allowed to update this absence')
      }
    }

    // @ts-ignore - "super" est injecte par Strapi dans ce contexte
    return await super.update(ctx)
  },
}))
