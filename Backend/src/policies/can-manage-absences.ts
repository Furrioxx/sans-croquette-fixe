import { canUserManageAbsences } from '../utils/absence-delegation'

export default async (policyContext, _config, { strapi }) => {
  const user = policyContext.state?.user

  if (!user) {
    return false
  }

  const { canManage } = await canUserManageAbsences(strapi, user)

  return canManage
}
