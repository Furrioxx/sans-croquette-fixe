export default async (policyContext, _config, { strapi }) => {
  const user = policyContext.state?.user;

  if (!user) {
    return false;
  }

  const roleName = user.role?.name ?? (await strapi.db.query("plugin::users-permissions.user").findOne({
    where: { id: user.id },
    populate: { role: true },
  }))?.role?.name;

  return roleName === "Admin" || roleName === "Volunteer";
};
