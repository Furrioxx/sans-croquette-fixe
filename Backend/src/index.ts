import type { Core } from '@strapi/strapi';

const PERMISSIONS_BY_ROLE: Record<string, string[]> = {
  Volunteer: [
    'api::absence.absence.find',
    'api::absence.absence.findOne',
    'api::absence.absence.create',
  ],
  Admin: [
    'api::absence.absence.find',
    'api::absence.absence.findOne',
    'api::absence.absence.create',
    'api::absence.absence.update',
    'api::absence.absence.delete',
    'api::user-role.user-role.getVolunteers',
    'api::user-role.user-role.getAvailableRoles',
    'api::user-role.user-role.updateUserRole',
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
    const roles = await strapi.db.query('plugin::users-permissions.role').findMany({
      where: {
        name: {
          $in: Object.keys(PERMISSIONS_BY_ROLE),
        },
      },
    });

    for (const role of roles) {
      const expectedActions = PERMISSIONS_BY_ROLE[role.name] ?? [];

      const existingPermissions = await strapi.db.query('plugin::users-permissions.permission').findMany({
        where: {
          role: role.id,
          action: {
            $in: expectedActions,
          },
        },
      });

      const existingActions = new Set(existingPermissions.map((permission) => permission.action));

      for (const action of expectedActions) {
        if (existingActions.has(action)) {
          continue;
        }

        await strapi.db.query('plugin::users-permissions.permission').create({
          data: {
            action,
            role: role.id,
          },
        });
      }
    }
  },
};
