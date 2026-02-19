export default (policyContext, _config, { strapi }) => {
  const user = policyContext.state?.user;

  if (!user) {
    return false;
  }

  return user.role?.name === "Admin";
};
