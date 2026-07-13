export default {
  async unsubscribe(ctx) {
    const { token } = ctx.request.query;

    if (!token) {
      return ctx.badRequest("Missing token");
    }

    const user = await strapi.db.query("plugin::users-permissions.user").findOne({
      where: { newsletterUnsubscribeToken: token },
    });

    if (!user) {
      return ctx.notFound();
    }

    await strapi.db.query("plugin::users-permissions.user").update({
      where: { id: user.id },
      data: { newsletterOptIn: false },
    });

    ctx.type = "html";
    ctx.body = `<!doctype html>
      <html>
        <body style="font-family: sans-serif; text-align: center; padding: 48px;">
          <h1>Désinscription confirmée</h1>
          <p>Vous ne recevrez plus la newsletter de Sans Croquettes Fixes.</p>
        </body>
      </html>`;
  },
};
