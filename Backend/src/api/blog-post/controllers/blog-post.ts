import { Core } from '@strapi/strapi'

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

const parsePagination = (query: Record<string, unknown>) => {
  const rawPage = Number(query.page ?? 1)
  const rawPageSize = Number(query.pageSize ?? 9)

  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const pageSize = Number.isFinite(rawPageSize) && rawPageSize > 0 ? rawPageSize : 9

  return { page, pageSize }
}

const normalizeSearch = (value: unknown) => {
  if (typeof value !== 'string') {
    return null
  }

  const trimmed = value.trim()
  return trimmed.length ? trimmed : null
}

const buildWhereClause = (search: string | null, isPublished?: boolean) => {
  const where: Record<string, unknown> = {}

  if (typeof isPublished === 'boolean') {
    where.isPublished = isPublished
  }

  if (search) {
    where.$or = [
      { title: { $containsi: search } },
      { excerpt: { $containsi: search } },
      { content: { $containsi: search } },
    ]
  }

  return where
}

const getPopulate = () => ({
  cover: true,
  author: {
    populate: {
      role: true,
    },
  },
})

const ensureUniqueSlug = async (
  strapi: Core.Strapi,
  title: string,
  currentDocumentId?: string,
) => {
  const baseSlug = slugify(title) || 'article'
  let slug = baseSlug
  let index = 1

  while (true) {
    const existing = await strapi.db.query(BLOG_POST_UID).findMany({
      where: currentDocumentId
        ? {
            slug,
            documentId: {
              $ne: currentDocumentId,
            },
          }
        : { slug },
      limit: 1,
    })

    if (!existing.length) {
      return slug
    }

    index += 1
    slug = `${baseSlug}-${index}`
  }
}

const ensurePersistedSlug = async (
  strapi: Core.Strapi,
  entry: any,
) => {
  if (entry?.slug) {
    return entry
  }

  const slug = await ensureUniqueSlug(strapi, entry.title, entry.documentId)

  const updatedEntry = await strapi.db.query(BLOG_POST_UID).update({
    where: { id: entry.id },
    data: { slug },
    populate: getPopulate(),
  })

  return updatedEntry
}

const sanitizePayload = (body: Record<string, unknown>) => {
  const data = (body.data ?? body) as Record<string, unknown>

  return {
    title: typeof data.title === 'string' ? data.title.trim() : '',
    excerpt: typeof data.excerpt === 'string' && data.excerpt.trim().length ? data.excerpt.trim() : null,
    content: typeof data.content === 'string' ? data.content.trim() : '',
    isPublished: Boolean(data.isPublished),
    cover: data.cover === null || typeof data.cover === 'number' ? data.cover : undefined,
  }
}

const findOneByWhere = async (
  strapi: Core.Strapi,
  where: Record<string, unknown>,
) => {
  const entries = await strapi.db.query(BLOG_POST_UID).findMany({
    where,
    limit: 1,
    populate: getPopulate(),
    orderBy: { createdAt: 'desc' },
  })

  return entries[0] ?? null
}

const findOneByDocumentId = async (strapi: Core.Strapi, documentId: string) => {
  const entries = await strapi.db.query(BLOG_POST_UID).findMany({
    populate: getPopulate(),
    orderBy: { createdAt: 'desc' },
  })

  return entries.find((entry) => entry.documentId === documentId) ?? null
}

const controller = ({ strapi }: { strapi: Core.Strapi }) => ({
  async findPublic(ctx) {
    const { page, pageSize } = parsePagination(ctx.query as Record<string, unknown>)
    const search = normalizeSearch(ctx.query.search)
    const where = buildWhereClause(search, true)

    const [results, total] = await strapi.db.query(BLOG_POST_UID).findWithCount({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      populate: getPopulate(),
      orderBy: [{ createdAt: 'desc' }],
    })

    const hydratedResults = await Promise.all(results.map((entry) => ensurePersistedSlug(strapi, entry)))

    ctx.body = {
      results: hydratedResults,
      total,
      page,
      pageSize,
    }
  },

  async findOnePublic(ctx) {
    const { identifier } = ctx.params

    let entry = await findOneByWhere(strapi, {
      slug: identifier,
      isPublished: true,
    })

    if (!entry) {
      const documentEntry = await findOneByDocumentId(strapi, identifier)

      if (documentEntry?.isPublished) {
        entry = documentEntry
      }
    }

    if (!entry) {
      const entriesWithoutSlug = await strapi.db.query(BLOG_POST_UID).findMany({
        where: {
          isPublished: true,
        },
        populate: getPopulate(),
        orderBy: { createdAt: 'desc' },
      })

      const fallbackEntry = entriesWithoutSlug.find((item) => slugify(item.title) === identifier)

      if (fallbackEntry) {
        entry = await ensurePersistedSlug(strapi, fallbackEntry)
      }
    }

    if (!entry) {
      return ctx.notFound('Article introuvable')
    }

    ctx.body = {
      data: entry,
    }
  },

  async findAdmin(ctx) {
    const { page, pageSize } = parsePagination(ctx.query as Record<string, unknown>)
    const search = normalizeSearch(ctx.query.search)
    const status = typeof ctx.query.status === 'string' ? ctx.query.status : 'all'
    const isPublished =
      status === 'published' ? true : status === 'draft' ? false : undefined

    const where = buildWhereClause(search, isPublished)

    const [results, total] = await strapi.db.query(BLOG_POST_UID).findWithCount({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      populate: getPopulate(),
      orderBy: [{ createdAt: 'desc' }],
    })

    const hydratedResults = await Promise.all(results.map((entry) => ensurePersistedSlug(strapi, entry)))

    ctx.body = {
      results: hydratedResults,
      total,
      page,
      pageSize,
    }
  },

  async findOneAdmin(ctx) {
    const { documentId } = ctx.params

    const entry = await findOneByDocumentId(strapi, documentId)

    if (!entry) {
      return ctx.notFound('Article introuvable')
    }

    ctx.body = {
      data: await ensurePersistedSlug(strapi, entry),
    }
  },

  async createAdmin(ctx) {
    const payload = sanitizePayload(ctx.request.body as Record<string, unknown>)

    if (!payload.title || !payload.content) {
      return ctx.badRequest('Le titre et le contenu sont requis')
    }

    const userId = ctx.state.user?.id
    const slug = await ensureUniqueSlug(strapi, payload.title)

    const entry = await strapi.db.query(BLOG_POST_UID).create({
      data: {
        ...payload,
        slug,
        author: userId,
      },
      populate: getPopulate(),
    })

    ctx.body = {
      data: entry,
    }
  },

  async updateAdmin(ctx) {
    const { documentId } = ctx.params
    const payload = sanitizePayload(ctx.request.body as Record<string, unknown>)

    if (!payload.title || !payload.content) {
      return ctx.badRequest('Le titre et le contenu sont requis')
    }

    const existingEntry = await findOneByDocumentId(strapi, documentId)

    if (!existingEntry) {
      return ctx.notFound('Article introuvable')
    }

    const slug = await ensureUniqueSlug(strapi, payload.title, documentId)

    const entry = await strapi.db.query(BLOG_POST_UID).update({
      where: { id: existingEntry.id },
      data: {
        ...payload,
        slug,
        author: existingEntry.author?.id ?? ctx.state.user?.id,
      },
      populate: getPopulate(),
    })

    ctx.body = {
      data: entry,
    }
  },

  async deleteAdmin(ctx) {
    const { documentId } = ctx.params

    const existingEntry = await findOneByDocumentId(strapi, documentId)

    if (!existingEntry) {
      return ctx.notFound('Article introuvable')
    }

    await strapi.db.query(BLOG_POST_UID).delete({
      where: { id: existingEntry.id },
    })

    ctx.body = {
      data: {
        documentId,
      },
    }
  },
})

export default controller
