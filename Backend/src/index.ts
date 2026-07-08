import type { Core } from "@strapi/strapi";

const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  Public: [
    "api::blog-post.blog-post.find",
    "api::blog-post.blog-post.findOne",
    "api::blog-category.blog-category.find",
    "api::blog-category.blog-category.findOne",
  ],
  User: [
    "api::blog-post.blog-post.find",
    "api::blog-post.blog-post.findOne",
    "api::blog-category.blog-category.find",
    "api::blog-category.blog-category.findOne",
    "api::adoption-request.adoption-request.create",
    "plugin::users-permissions.user.me",
    "api::user-profile.user-profile.me",
  ],
  Volunteer: [
    "plugin::users-permissions.user.me",
    "api::user-profile.user-profile.me",
    "api::adoption-request.adoption-request.create",
    "api::adoption-request.adoption-request.find",
    "api::adoption-request.adoption-request.findOne",
    "api::adoption-request.adoption-request.update",
    "api::adoption-request.adoption-request.delete",
    "api::absence.absence.find",
    "api::absence.absence.findOne",
    "api::absence.absence.create",
    "api::absence.absence.update",
    "api::absence-delegation.absence-delegation.getMyStatus",
    "api::blog-post.blog-post.find",
    "api::blog-post.blog-post.findOne",
    "api::blog-post.blog-post.create",
    "api::blog-post.blog-post.update",
    "api::blog-category.blog-category.find",
    "api::blog-category.blog-category.findOne",
    "api::blog-category.blog-category.create",
    "api::blog-category.blog-category.update",
    "plugin::users-permissions.user.find",
    "plugin::users-permissions.user.findOne",
  ],
  Admin: [
    "plugin::users-permissions.user.me",
    "api::user-profile.user-profile.me",
    "api::adoption-request.adoption-request.create",
    "api::adoption-request.adoption-request.find",
    "api::adoption-request.adoption-request.findOne",
    "api::adoption-request.adoption-request.update",
    "api::adoption-request.adoption-request.delete",
    "api::absence.absence.find",
    "api::absence.absence.findOne",
    "api::absence.absence.create",
    "api::absence.absence.update",
    "api::absence.absence.delete",
    "api::absence-delegation.absence-delegation.getMyStatus",
    "api::absence-delegation.absence-delegation.deactivate",
    "api::blog-post.blog-post.find",
    "api::blog-post.blog-post.findOne",
    "api::blog-post.blog-post.create",
    "api::blog-post.blog-post.update",
    "api::blog-post.blog-post.delete",
    "api::blog-category.blog-category.find",
    "api::blog-category.blog-category.findOne",
    "api::blog-category.blog-category.create",
    "api::blog-category.blog-category.update",
    "api::blog-category.blog-category.delete",
    "plugin::users-permissions.user.find",
    "plugin::users-permissions.user.findOne",
    "api::user-role.user-role.getVolunteers",
    "api::user-role.user-role.getAvailableRoles",
    "api::user-role.user-role.updateUserRole",
    "api::tarification.tarification.find",
    "api::tarification.tarification.findOne",
    "api::tarification.tarification.create",
    "api::tarification.tarification.update",
  ],
};

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const roles = await strapi.db
      .query("plugin::users-permissions.role")
      .findMany({
        where: {
          name: {
            $in: Object.keys(PERMISSIONS_BY_ROLE),
          },
        },
      });

    for (const role of roles) {
      const expectedActions = PERMISSIONS_BY_ROLE[role.name] ?? [];

      const existingPermissions = await strapi.db
        .query("plugin::users-permissions.permission")
        .findMany({
          where: {
            role: role.id,
            action: {
              $in: expectedActions,
            },
          },
        });

      const existingActions = new Set(
        existingPermissions.map((permission) => permission.action),
      );

      for (const action of expectedActions) {
        if (existingActions.has(action)) {
          continue;
        }

        await strapi.db.query("plugin::users-permissions.permission").create({
          data: {
            action,
            role: role.id,
          },
        });
      }
    }
  },
};
