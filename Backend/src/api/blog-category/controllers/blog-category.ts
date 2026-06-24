import { Core } from '@strapi/strapi'

const BLOG_CATEGORY_UID = 'api::blog-category.blog-category'
const BLOG_POST_UID = 'api::blog-post.blog-post'

const slugify = (value: string) => {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const ensureUniqueSlug = async (
  strapi: Core.Strapi,
  name: string,
  currentId?: number,
) => {
  const baseSlug = slugify(name) || 'categorie'
  let slug = baseSlug
  let index = 1

  while (true) {
    const entries = await strapi.db.query(BLOG_CATEGORY_UID).findMany({
      where: { slug },
      limit: 5,
    })

    const conflict = entries.find((entry) => entry.id !== currentId)

    if (!conflict) {
      return slug
    }

    index += 1
    slug = `${baseSlug}-${index}`
  }
}

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findPublic(ctx) {
    const results = await strapi.db.query(BLOG_CATEGORY_UID).findMany({
      orderBy: { name: 'asc' },
    })

    ctx.body = { data: results }
  },

  async findAdmin(ctx) {
    const results = await strapi.db.query(BLOG_CATEGORY_UID).findMany({
      orderBy: { name: 'asc' },
    })

    ctx.body = { data: results }
  },

  async createAdmin(ctx) {
    const body = (ctx.request.body?.data ?? ctx.request.body) as Record<string, unknown>
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!name) {
      return ctx.badRequest('Le nom de la catégorie est requis')
    }

    const slug = await ensureUniqueSlug(strapi, name)

    const entry = await strapi.db.query(BLOG_CATEGORY_UID).create({
      data: { name, slug },
    })

    ctx.body = { data: entry }
  },

  async updateAdmin(ctx) {
    const { id } = ctx.params
    const body = (ctx.request.body?.data ?? ctx.request.body) as Record<string, unknown>
    const name = typeof body.name === 'string' ? body.name.trim() : ''

    if (!name) {
      return ctx.badRequest('Le nom de la catégorie est requis')
    }

    const existingEntry = await strapi.db.query(BLOG_CATEGORY_UID).findOne({
      where: { id: Number(id) },
    })

    if (!existingEntry) {
      return ctx.notFound('Catégorie introuvable')
    }

    const slug = await ensureUniqueSlug(strapi, name, existingEntry.id)

    const entry = await strapi.db.query(BLOG_CATEGORY_UID).update({
      where: { id: existingEntry.id },
      data: { name, slug },
    })

    ctx.body = { data: entry }
  },

  async deleteAdmin(ctx) {
    const { id } = ctx.params

    const existingEntry = await strapi.db.query(BLOG_CATEGORY_UID).findOne({
      where: { id: Number(id) },
    })

    if (!existingEntry) {
      return ctx.notFound('Catégorie introuvable')
    }

    const relatedPosts = await strapi.db.query(BLOG_POST_UID).findMany({
      where: {
        category: {
          id: existingEntry.id,
        },
      },
    })

    await Promise.all(
      relatedPosts.map((post) =>
        strapi.db.query(BLOG_POST_UID).update({
          where: { id: post.id },
          data: { category: null },
        }),
      ),
    )

    await strapi.db.query(BLOG_CATEGORY_UID).delete({
      where: { id: existingEntry.id },
    })

    ctx.body = { data: { id: existingEntry.id } }
  },
})

export default controller
