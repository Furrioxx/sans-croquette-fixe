/**
 * absence controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController("api::absence.absence", ({ strapi }) => ({
  async getFullUser(userId: number) {
    return await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { id: userId },
      populate: { role: true },
    });
  },

  async getRoleName(user: any) {
    if (!user) {
      return null;
    }

    if (user.role?.name) {
      return user.role.name;
    }

    const fullUser = await this.getFullUser(user.id);

    return fullUser?.role?.name ?? null;
  },

  async create(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be authenticated");
    }

    const body = ctx.request.body as any;
    const roleName = await this.getRoleName(user);
    const payload = (body?.data || body) as any;
    let targetUserId = user.id;

    if (roleName === "Admin" && payload?.user) {
      const targetUser = await this.getFullUser(payload.user);

      if (!targetUser || targetUser.role?.name !== "Volunteer") {
        return ctx.badRequest("Selected user must be a volunteer");
      }

      targetUserId = targetUser.id;
    }

    ctx.request.body = {
      ...body,
      data: {
        ...payload,
        user: targetUserId,
      },
    };

    // Appel du contrôleur de base de Strapi
    // @ts-ignore - "super" est injecté par Strapi dans ce contexte
    return await super.create(ctx);
  },

  async find(ctx) {
    const user = ctx.state.user;
    const roleName = await this.getRoleName(user);

    // Un bénévole (ou tout rôle non Admin) ne voit que ses propres absences
    if (roleName !== "Admin") {
      const query = (ctx.query || {}) as any;
      const existingFilters = (query.filters || {}) as any;

      ctx.query = {
        ...query,
        filters: {
          ...existingFilters,
          user: user.id,
        },
      };
    }

    // @ts-ignore - "super" est injecté par Strapi dans ce contexte
    return await super.find(ctx);
  },

  async findOne(ctx) {
    const user = ctx.state.user;

    if (!user) {
      return ctx.unauthorized("You must be authenticated");
    }

    const roleName = await this.getRoleName(user);

    if (roleName !== "Admin") {
      const entity = await strapi.db.query("api::absence.absence").findOne({
        where: { documentId: ctx.params.id },
        populate: { user: true },
      });

      if (!entity || entity.user?.id !== user.id) {
        return ctx.forbidden("You are not allowed to access this absence");
      }
    }

    // @ts-ignore - "super" est injecté par Strapi dans ce contexte
    return await super.findOne(ctx);
  },
}));
