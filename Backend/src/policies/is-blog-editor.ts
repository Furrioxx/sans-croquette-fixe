import { Core } from '@strapi/strapi'

type PolicyConfig = {
  roles?: string[]
}

const DEFAULT_ROLES = ['Admin', 'Volunteer']

export default async (
  policyContext,
  config: PolicyConfig = {},
  { strapi }: { strapi: Core.Strapi },
) => {
  let user = policyContext.state?.user

  if (!user) {
    try {
      const token = await strapi.plugin('users-permissions').service('jwt').getToken(policyContext)

      if (!token?.id) {
        return false
      }

      user = await strapi
        .plugin('users-permissions')
        .service('user')
        .fetchAuthenticatedUser(token.id)

      policyContext.state.user = user
    } catch {
      return false
    }
  }

  if (!user) {
    return false
  }

  const allowedRoles = config.roles?.length ? config.roles : DEFAULT_ROLES

  return allowedRoles.includes(user.role?.name)
}
