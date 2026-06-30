type AuthUser = {
  id: number
  role?: {
    name?: string | null
  } | null
}

const ACTIVE_DELEGATION_POPULATE = {
  adminUser: {
    populate: {
      role: true,
    },
  },
  delegateUser: {
    populate: {
      role: true,
    },
  },
}

export const getFullUser = async (strapi: any, userId: number) => {
  return await strapi.db.query('plugin::users-permissions.user').findOne({
    where: { id: userId },
    populate: { role: true },
  })
}

export const getRoleName = async (strapi: any, user: AuthUser | null | undefined) => {
  if (!user) {
    return null
  }

  if (user.role?.name) {
    return user.role.name
  }

  const fullUser = await getFullUser(strapi, user.id)

  return fullUser?.role?.name ?? null
}

export const getActiveDelegationForDelegate = async (
  strapi: any,
  delegateUserId: number,
  referenceDate = new Date().toISOString(),
) => {
  return await strapi.db.query('api::absence-delegation.absence-delegation').findOne({
    where: {
      delegateUser: delegateUserId,
      isActive: true,
      startDate: {
        $lte: referenceDate,
      },
      endDate: {
        $gte: referenceDate,
      },
    },
    populate: ACTIVE_DELEGATION_POPULATE,
    orderBy: { startDate: 'desc' },
  })
}

export const getActiveDelegationsForAdmin = async (
  strapi: any,
  adminUserId: number,
  referenceDate = new Date().toISOString(),
) => {
  return await strapi.db.query('api::absence-delegation.absence-delegation').findMany({
    where: {
      adminUser: adminUserId,
      isActive: true,
      endDate: {
        $gte: referenceDate,
      },
    },
    populate: ACTIVE_DELEGATION_POPULATE,
    orderBy: [{ startDate: 'asc' }],
  })
}

export const canUserManageAbsences = async (strapi: any, user: AuthUser | null | undefined) => {
  const roleName = await getRoleName(strapi, user)

  if (roleName === 'Admin') {
    return {
      canManage: true,
      roleName,
      activeDelegation: null,
    }
  }

  if (!user) {
    return {
      canManage: false,
      roleName,
      activeDelegation: null,
    }
  }

  const activeDelegation = await getActiveDelegationForDelegate(strapi, user.id)

  return {
    canManage: !!activeDelegation,
    roleName,
    activeDelegation,
  }
}
