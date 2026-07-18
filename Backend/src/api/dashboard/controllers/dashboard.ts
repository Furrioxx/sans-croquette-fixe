import type { Core } from "@strapi/strapi";
import { getRoleName } from "../../../utils/absence-delegation";

type AuthUser = {
  id: number;
  role?: {
    name?: string | null;
  } | null;
};

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  async getSummary(ctx) {
    const user = ctx.state.user as AuthUser | undefined;

    if (!user) {
      return ctx.unauthorized("You must be authenticated");
    }

    const roleName = await getRoleName(strapi, user);

    if (roleName !== "Admin" && roleName !== "Volunteer") {
      return ctx.forbidden("You are not allowed to access the dashboard");
    }

    ctx.body = {
      data: await strapi
        .service("api::dashboard.dashboard")
        .getSummary(user, roleName),
    };
  },
});
