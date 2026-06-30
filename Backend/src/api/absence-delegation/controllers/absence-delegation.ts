import { Core } from '@strapi/strapi'
import {
  canUserManageAbsences,
  getActiveDelegationsForAdmin,
  getRoleName,
} from '../../../utils/absence-delegation'

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getMyStatus(ctx) {
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const { canManage, activeDelegation } = await canUserManageAbsences(strapi, user)
    const roleName = await getRoleName(strapi, user)
    const activeOwnedDelegations =
      roleName === 'Admin' ? await getActiveDelegationsForAdmin(strapi, user.id) : []

    ctx.body = {
      data: {
        canManageAbsences: canManage,
        isDelegatedManager: roleName !== 'Admin' && !!activeDelegation,
        activeDelegation,
        activeOwnedDelegations,
      },
    }
  },

  async deactivate(ctx) {
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const roleName = await getRoleName(strapi, user)

    if (roleName !== 'Admin') {
      return ctx.forbidden('You are not allowed to manage delegations')
    }

    const delegationId = Number(ctx.params.id)

    if (!delegationId) {
      return ctx.badRequest('Delegation id is required')
    }

    const existingDelegation = await strapi
      .db.query('api::absence-delegation.absence-delegation')
      .findOne({
        where: {
          id: delegationId,
          adminUser: user.id,
        },
      })

    if (!existingDelegation) {
      return ctx.notFound('Delegation not found')
    }

    const updatedDelegation = await strapi
      .db.query('api::absence-delegation.absence-delegation')
      .update({
        where: { id: delegationId },
        data: {
          isActive: false,
        },
      })

    ctx.body = {
      data: updatedDelegation,
    }
  },
})

export default controller
