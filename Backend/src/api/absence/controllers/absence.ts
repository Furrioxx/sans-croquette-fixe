/**
 * absence controller
 */

import { factories } from '@strapi/strapi'
import {
  canUserManageAbsences,
  getDelegationBySourceAbsenceDocumentId,
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
  excludedDocumentId?: string,
) => {
  const existingAbsences = await strapi.documents('api::absence.absence').findMany({
    status: 'draft',
    filters: {
      user: {
        id: {
          $eq: userId,
        },
      },
      ...(excludedDocumentId
        ? {
            documentId: {
              $ne: excludedDocumentId,
            },
          }
        : {}),
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

  return existingAbsences.length > 0
}

const getAbsenceWithRelations = async (strapi: any, documentId: string) => {
  return await strapi.documents('api::absence.absence').findOne({
    documentId,
    status: 'draft',
    populate: {
      user: {
        populate: {
          role: true,
        },
      },
    },
  })
}

const getAbsencesWithRelations = async (
  strapi: any,
  options?: {
    userId?: number
  },
) => {
  return await strapi.documents('api::absence.absence').findMany({
    status: 'draft',
    filters: options?.userId
      ? {
          user: {
            id: {
              $eq: options.userId,
            },
          },
        }
      : undefined,
    populate: {
      user: {
        populate: {
          role: true,
        },
      },
    },
    sort: {
      startDate: 'desc',
    },
  })
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
    const { delegateUserId: _delegateUserId, ...absenceData } = payload
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

    const createdAbsence = await strapi.documents('api::absence.absence').create({
      status: 'draft',
      data: {
        ...absenceData,
        absence_status:
          payload.absence_status ?? (roleName === 'Admin' && !payload?.user ? 'approved' : 'pending'),
        user: targetUserId,
      },
    })

    if (roleName === 'Admin' && !payload?.user && delegateUserId) {
      await strapi.db.query('api::absence-delegation.absence-delegation').create({
        data: {
          startDate: payload.startDate,
          endDate: payload.endDate,
          adminUser: user.id,
          delegateUser: delegateUserId,
          isActive: true,
          sourceAbsenceDocumentId: createdAbsence?.documentId,
        },
      })
    }

    const populatedAbsence = await getAbsenceWithRelations(strapi, createdAbsence.documentId)

    return { data: populatedAbsence }
  },

  async find(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const { canManage } = await canUserManageAbsences(strapi, user)

    const absences = await getAbsencesWithRelations(strapi, {
      userId: canManage ? undefined : user.id,
    })

    return { data: absences }
  },

  async findOne(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const { canManage } = await canUserManageAbsences(strapi, user)
    const entity = await getAbsenceWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Absence not found')
    }

    if (!canManage) {
      if (entity.user?.id !== user.id) {
        return ctx.forbidden('You are not allowed to access this absence')
      }
    }

    return { data: entity }
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

    const entity = await getAbsenceWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Absence not found')
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

      if (entity.user?.role?.name === 'Admin') {
        return ctx.forbidden('You are not allowed to update this absence')
      }
    }

    if (roleName === 'Admin' && entity.user?.id === user.id && entity.user?.role?.name === 'Admin') {
      const body = ctx.request.body as any
      const payload = (body?.data || body) as any
      const { delegateUserId: _delegateUserId, ...absenceData } = payload
      const dateError = getDateError({
        startDate: payload.startDate ?? entity.startDate,
        endDate: payload.endDate ?? entity.endDate,
      })
      const delegateUserId = payload?.delegateUserId

      if (dateError) {
        return ctx.badRequest(dateError)
      }

      if (!delegateUserId) {
        return ctx.badRequest('Delegate user is required')
      }

      const delegateUser = await getFullUser(strapi, delegateUserId)

      if (
        !delegateUser ||
        delegateUser.role?.name !== 'Volunteer' ||
        delegateUser.confirmed !== true ||
        delegateUser.blocked === true
      ) {
        return ctx.badRequest('Selected delegate must be an active volunteer')
      }

      const overlappingAbsence = await hasOverlappingAbsence(
        strapi,
        user.id,
        payload.startDate ?? entity.startDate,
        payload.endDate ?? entity.endDate,
        ctx.params.id,
      )

      if (overlappingAbsence) {
        return ctx.badRequest('This volunteer already has an absence during this period')
      }

      await strapi.documents('api::absence.absence').update({
        documentId: ctx.params.id,
        data: {
          ...absenceData,
          absence_status: 'approved',
          user: user.id,
        },
      })

      const delegation = await getDelegationBySourceAbsenceDocumentId(strapi, ctx.params.id)

      if (delegation) {
        await strapi.db.query('api::absence-delegation.absence-delegation').update({
          where: { id: delegation.id },
          data: {
            startDate: payload.startDate ?? entity.startDate,
            endDate: payload.endDate ?? entity.endDate,
            delegateUser: delegateUserId,
            isActive: true,
          },
        })
      }

      return { data: await getAbsenceWithRelations(strapi, ctx.params.id) }
    }

    const body = ctx.request.body as any
    const payload = (body?.data || body) as any

    await strapi.documents('api::absence.absence').update({
      documentId: ctx.params.id,
      data: payload,
    })

    return { data: await getAbsenceWithRelations(strapi, ctx.params.id) }
  },

  async delete(ctx) {
    const user = ctx.state.user as AuthUser | undefined

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      return ctx.forbidden('You are not allowed to delete absences')
    }

    const entity = await getAbsenceWithRelations(strapi, ctx.params.id)

    if (!entity) {
      return ctx.notFound('Absence not found')
    }

    if (entity.user?.id === user.id && entity.user?.role?.name === 'Admin') {
      const delegation = await getDelegationBySourceAbsenceDocumentId(strapi, ctx.params.id)

      if (delegation) {
        await strapi.db.query('api::absence-delegation.absence-delegation').delete({
          where: { id: delegation.id },
        })
      }
    }

    await strapi.documents('api::absence.absence').delete({
      documentId: ctx.params.id,
    })

    return { data: entity }
  },
}))
