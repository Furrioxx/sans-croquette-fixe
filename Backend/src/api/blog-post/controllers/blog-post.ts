import { Core } from '@strapi/strapi'

const BLOG_POST_UID = 'api::blog-post.blog-post'
const BLOG_CATEGORY_UID = 'api::blog-category.blog-category'

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
  category: true,
  author: {
    populate: {
      role: true,
    },
  },
})

const ensureUniqueSlug = async (
  strapi: Core.Strapi,
  title: string,
  currentId?: number,
) => {
  const baseSlug = slugify(title) || 'article'
  let slug = baseSlug
  let index = 1

  while (true) {
    const existing = await strapi.db.query(BLOG_POST_UID).findMany({
      where: { slug },
      limit: 5,
    })

    const conflict = existing.find((entry) => entry.id !== currentId)

    if (!conflict) {
      return slug
    }

    index += 1
    slug = `${baseSlug}-${index}`
  }
}

const getAuthorRoleLabel = (user: any) => {
  if (!user?.role?.name) {
    return null
  }

  return user.role.name
}

const ensurePersistedSlug = async (
  strapi: Core.Strapi,
  entry: any,
) => {
  if (entry?.slug) {
    return entry
  }

  const slug = await ensureUniqueSlug(strapi, entry.title, entry.id)

  const updatedEntry = await strapi.db.query(BLOG_POST_UID).update({
    where: { id: entry.id },
    data: { slug },
    populate: getPopulate(),
  })

  return updatedEntry
}

const sanitizePayload = (body: Record<string, unknown>) => {
  const data = (body.data ?? body) as Record<string, unknown>
  const content = typeof data.content === 'string' ? data.content.trim() : ''
  const excerpt =
    typeof data.excerpt === 'string' && data.excerpt.trim().length ? data.excerpt.trim() : null
  const seoTitle =
    typeof data.seoTitle === 'string' && data.seoTitle.trim().length ? data.seoTitle.trim() : null
  const seoDescription =
    typeof data.seoDescription === 'string' && data.seoDescription.trim().length
      ? data.seoDescription.trim()
      : null
  const category =
    typeof data.category === 'number' && Number.isFinite(data.category) ? Number(data.category) : null

  return {
    title: typeof data.title === 'string' ? data.title.trim() : '',
    excerpt: excerpt ?? (content ? content.slice(0, 180) : null),
    content,
    seoTitle,
    seoDescription: seoDescription ?? excerpt ?? (content ? content.slice(0, 160) : null),
    isPublished: Boolean(data.isPublished),
    isFeatured: Boolean(data.isFeatured),
    cover: data.cover === null || typeof data.cover === 'number' ? data.cover : undefined,
    category,
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
    const categorySlug = normalizeSearch(ctx.query.category)
    const where = buildWhereClause(search, true)

    where.publishedAt = {
      $notNull: true,
    }

    if (categorySlug) {
      where.category = {
        slug: categorySlug,
      }
    }

    const [results, total] = await strapi.db.query(BLOG_POST_UID).findWithCount({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      populate: getPopulate(),
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
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
      publishedAt: {
        $notNull: true,
      },
    })

    if (!entry) {
      const documentEntry = await findOneByDocumentId(strapi, identifier)

      if (documentEntry?.isPublished && documentEntry?.publishedAt) {
        entry = documentEntry
      }
    }

    if (!entry) {
      const entriesWithoutSlug = await strapi.db.query(BLOG_POST_UID).findMany({
        where: {
          isPublished: true,
          publishedAt: {
            $notNull: true,
          },
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

    if (status === 'published') {
      where.publishedAt = {
        $notNull: true,
      }
    }

    if (status === 'draft') {
      where.publishedAt = null
    }

    const [results, total] = await strapi.db.query(BLOG_POST_UID).findWithCount({
      where,
      offset: (page - 1) * pageSize,
      limit: pageSize,
      populate: getPopulate(),
      orderBy: [{ isFeatured: 'desc' }, { publishedAt: 'desc' }, { createdAt: 'desc' }],
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

    if (!payload.category) {
      return ctx.badRequest('La catégorie est requise')
    }

    const user = ctx.state.user
    const slug = await ensureUniqueSlug(strapi, payload.title)
    const publishedAt = payload.isPublished ? new Date().toISOString() : null

    const category = await strapi.db.query(BLOG_CATEGORY_UID).findOne({
      where: { id: payload.category },
    })

    if (!category) {
      return ctx.badRequest('La catégorie est invalide')
    }

    const entry = await strapi.db.query(BLOG_POST_UID).create({
      data: {
        ...payload,
        slug,
        publishedAt,
        author: user?.id,
        authorRoleLabel: getAuthorRoleLabel(user),
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

    if (!payload.category) {
      return ctx.badRequest('La catégorie est requise')
    }

    const category = await strapi.db.query(BLOG_CATEGORY_UID).findOne({
      where: { id: payload.category },
    })

    if (!category) {
      return ctx.badRequest('La catégorie est invalide')
    }

    const slug = await ensureUniqueSlug(strapi, payload.title, existingEntry.id)
    const publishedAt =
      payload.isPublished
        ? existingEntry.publishedAt ?? new Date().toISOString()
        : null

    const entry = await strapi.db.query(BLOG_POST_UID).update({
      where: { id: existingEntry.id },
      data: {
        ...payload,
        slug,
        publishedAt,
        author: existingEntry.author?.id ?? ctx.state.user?.id,
        authorRoleLabel: existingEntry.authorRoleLabel ?? getAuthorRoleLabel(ctx.state.user),
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
