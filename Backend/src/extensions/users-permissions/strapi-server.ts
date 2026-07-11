import crypto from "crypto";

export default (plugin: any) => {
  // In Strapi v5, `plugin.controllers.auth` is a factory function
  // `({ strapi }) => ({ register, ... })`. The controller registry instantiates
  // it by *calling* the factory, so mutating `plugin.controllers.auth.register`
  // directly is discarded. We must replace the factory and wrap the instance it
  // returns.
  const authFactory = plugin.controllers.auth;

  plugin.controllers.auth = (deps: any) => {
    const controller =
      typeof authFactory === "function" ? authFactory(deps) : authFactory;

    const originalRegister = controller.register;

    controller.register = async (ctx: any) => {
      await originalRegister.call(controller, ctx);

      const userId = ctx.body?.user?.id;

      if (!userId) {
        return;
      }

      try {
        const newsletterUnsubscribeToken = crypto.randomBytes(32).toString("hex");

        await strapi.db.query("plugin::users-permissions.user").update({
          where: { id: userId },
          data: { newsletterUnsubscribeToken },
        });
      } catch (err) {
        strapi.log.error(
          "[newsletter] register override: failed to generate unsubscribe token",
          err,
        );
      }
    };

    return controller;
  };

  return plugin;
};
