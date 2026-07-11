import { Core } from '@strapi/strapi'

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async me(ctx) {
    const user = ctx.state.user

    if (!user) {
      return ctx.unauthorized('You must be authenticated')
    }

    const fullUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: user.id },
      populate: {
        role: true,
      },
    })

    if (!fullUser) {
      return ctx.notFound('User not found')
    }

    delete fullUser.newsletterUnsubscribeToken

    ctx.body = fullUser
  },
})

export default controller
