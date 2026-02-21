export default {
  routes: [
    {
      method: "GET",
      path: "/user-roles/available",
      handler: "api::user-role.user-role.getAvailableRoles",
      config: {
        policies: ["global::is-admin"],
      },
    },
    {
      method: "PUT",
      path: "/user-roles/:userId",
      handler: "api::user-role.user-role.updateUserRole",
      config: {
        policies: ["global::is-admin"],
      },
    },
  ],
};
