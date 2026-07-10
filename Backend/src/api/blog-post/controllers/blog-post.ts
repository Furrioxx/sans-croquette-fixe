import { factories } from '@strapi/strapi'

const syncPublishState = async (strapi: any, documentId: string | undefined, status: unknown) => {
  if (!documentId) return

  const service = strapi.documents('api::blog-post.blog-post')

  if (status === 'published') {
    await service.publish({ documentId })
  } else if (status === 'draft') {
    await service.unpublish({ documentId })
  }
}

export default factories.createCoreController('api::blog-post.blog-post' as any, ({ strapi }) => ({
  async create(ctx) {
    const response = await super.create(ctx)
    await syncPublishState(strapi, response?.data?.documentId, ctx.query.status)
    return response
  },

  async update(ctx) {
    const response = await super.update(ctx)
    await syncPublishState(strapi, response?.data?.documentId, ctx.query.status)
    return response
  },
}))
