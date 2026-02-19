import { Core } from "@strapi/strapi";

const ALLOWED_ROLES = ["Admin", "Volunteer", "User"];

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async getAvailableRoles(ctx) {
    // Récupère tous les rôles du plugin Users & Permissions
    const allRoles = await strapi
      .plugin("users-permissions")
      .service("role")
      .find();

    // Filtre uniquement les rôles prédéfinis
    const filteredRoles = allRoles.filter((role: any) =>
      ALLOWED_ROLES.includes(role.name),
    );

    ctx.body = { data: filteredRoles };
  },

  async updateUserRole(ctx) {
    const { userId } = ctx.params;
    const { roleId } = ctx.request.body as { roleId: number };

    if (!userId || !roleId) {
      return ctx.badRequest("userId et roleId sont requis");
    }

    // Vérifie que le rôle cible fait partie des rôles autorisés
    const allRoles = await strapi
      .plugin("users-permissions")
      .service("role")
      .find();

    const targetRole = allRoles.find((r: any) => r.id === roleId);

    if (!targetRole || !ALLOWED_ROLES.includes(targetRole.name)) {
      return ctx.forbidden("Ce rôle ne peut pas être assigné");
    }

    // Met à jour le rôle de l'utilisateur
    const updatedUser = await strapi
      .plugin("users-permissions")
      .service("user")
      .edit(userId, { role: roleId });

    ctx.body = { data: updatedUser };
  },
});

export default controller;
