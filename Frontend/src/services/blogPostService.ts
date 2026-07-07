import type { BlogPostPostPut } from '@/models/BlogPost'
import { axiosInstance } from './axiosInsance'
import { toStrapiQueryString, type StrapiQueryValue } from '@/utils/strapiQuery'

const API_URL = '/blog-posts'

const PUBLIC_BLOG_POST_POPULATE = {
  cover: {
    fields: ['url', 'name'],
  },
  category: {
    fields: ['name', 'slug'],
  },
}

const ADMIN_BLOG_POST_POPULATE = {
  ...PUBLIC_BLOG_POST_POPULATE,
  author: {
    fields: ['username', 'email'],
  },
}

export interface BlogPostQueryParams {
  page: number
  pageSize: number
  search?: string
  status?: 'all' | 'published' | 'draft'
  category?: string
}

interface StrapiCollectionResponse<T> {
  data: T[]
  meta: {
    pagination: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

const buildFilters = (params: BlogPostQueryParams) => {
  const filters: Record<string, StrapiQueryValue> = {}

  if (params.category) {
    filters.category = {
      slug: {
        $eq: params.category,
      },
    }
  }

  if (params.search) {
    filters.$or = [
      { title: { $containsi: params.search } },
      { excerpt: { $containsi: params.search } },
      { content: { $containsi: params.search } },
    ]
  }

  return filters
}

const buildCollectionQuery = (
  params: BlogPostQueryParams,
  populate: typeof PUBLIC_BLOG_POST_POPULATE | typeof ADMIN_BLOG_POST_POPULATE,
) =>
  toStrapiQueryString({
    pagination: {
      page: params.page,
      pageSize: params.pageSize,
    },
    filters: buildFilters(params),
    populate,
    sort: ['isFeatured:desc', 'publishedAt:desc', 'createdAt:desc'],
    ...(params.status && params.status !== 'all' ? { status: params.status } : {}),
  })

const buildAdminQueryParams = (params: BlogPostQueryParams, status: 'published' | 'draft') =>
  buildCollectionQuery(
    {
      ...params,
      page: 1,
      pageSize: 100,
      status,
    },
    ADMIN_BLOG_POST_POPULATE,
  )

const paginateDocuments = <T>(documents: T[], page: number, pageSize: number): StrapiCollectionResponse<T> => {
  const total = documents.length
  const pageCount = total === 0 ? 0 : Math.ceil(total / pageSize)
  const safePage = Math.max(1, page)
  const start = (safePage - 1) * pageSize

  return {
    data: documents.slice(start, start + pageSize),
    meta: {
      pagination: {
        page: safePage,
        pageSize,
        pageCount,
        total,
      },
    },
  }
}

export const BlogPostService = {
  GetPublicBlogPosts: async (params: BlogPostQueryParams) => {
    return await axiosInstance.get(
      `${API_URL}?${buildCollectionQuery({ ...params, status: 'published' }, PUBLIC_BLOG_POST_POPULATE)}`,
    )
  },

  GetPublicBlogPost: async (identifier: string) => {
    try {
      return await axiosInstance.get(
        `${API_URL}/${identifier}?${toStrapiQueryString({
          populate: PUBLIC_BLOG_POST_POPULATE,
        })}`,
      )
    } catch {
      const response = await axiosInstance.get(
        `${API_URL}?${toStrapiQueryString({
          filters: {
            slug: {
              $eq: identifier,
            },
          },
          pagination: {
            page: 1,
            pageSize: 1,
          },
          populate: PUBLIC_BLOG_POST_POPULATE,
        })}`,
      )

      return {
        ...response,
        data: {
          data: response.data.data[0] ?? null,
          meta: response.data.meta,
        },
      }
    }
  },

  GetAdminBlogPosts: async (params: BlogPostQueryParams) => {
    if (params.status === 'published') {
      return await axiosInstance.get(`${API_URL}?${buildCollectionQuery(params, ADMIN_BLOG_POST_POPULATE)}`)
    }

    const [publishedResponse, draftResponse] = await Promise.all([
      axiosInstance.get<StrapiCollectionResponse<any>>(`${API_URL}?${buildAdminQueryParams(params, 'published')}`),
      axiosInstance.get<StrapiCollectionResponse<any>>(`${API_URL}?${buildAdminQueryParams(params, 'draft')}`),
    ])

    const publishedDocuments = publishedResponse.data.data
    const publishedIds = new Set(publishedDocuments.map((document) => document.documentId))
    const draftOnlyDocuments = draftResponse.data.data.filter(
      (document) => !publishedIds.has(document.documentId),
    )

    const documents = params.status === 'draft'
      ? draftOnlyDocuments
      : [...publishedDocuments, ...draftOnlyDocuments]

    return {
      data: paginateDocuments(documents, params.page, params.pageSize),
    }
  },

  GetAdminBlogPost: async (documentId: string) => {
    try {
      return await axiosInstance.get(
        `${API_URL}/${documentId}?${toStrapiQueryString({
          status: 'draft',
          populate: ADMIN_BLOG_POST_POPULATE,
        })}`,
      )
    } catch {
      return await axiosInstance.get(
        `${API_URL}/${documentId}?${toStrapiQueryString({
          populate: ADMIN_BLOG_POST_POPULATE,
        })}`,
      )
    }
  },

  AddBlogPost: async (blogPost: BlogPostPostPut, status: 'draft' | 'published') => {
    return await axiosInstance.post(`${API_URL}?${toStrapiQueryString({ status })}`, {
      data: blogPost,
    })
  },

  UpdateBlogPost: async (documentId: string, blogPost: BlogPostPostPut, status: 'draft' | 'published') => {
    return await axiosInstance.put(`${API_URL}/${documentId}?${toStrapiQueryString({ status })}`, {
      data: blogPost,
    })
  },

  DeleteBlogPost: async (documentId: string) => {
    return await axiosInstance.delete(`${API_URL}/${documentId}`)
  },

  UploadCover: async (formData: FormData) => {
    return await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
