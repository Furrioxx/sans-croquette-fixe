import { axiosInstance } from './axiosInsance'
import { toStrapiQueryString } from '@/utils/strapiQuery'
import { slugify } from '@/utils/slugify'

const API_URL = '/blog-categories'

const CATEGORY_LIST_QUERY = toStrapiQueryString({
  sort: ['name:asc'],
  pagination: {
    page: 1,
    pageSize: 100,
  },
})

export const BlogCategoryService = {
  GetPublicCategories: async () => {
    return await axiosInstance.get(`${API_URL}?${CATEGORY_LIST_QUERY}`)
  },

  GetAdminCategories: async () => {
    return await axiosInstance.get(`${API_URL}?${CATEGORY_LIST_QUERY}`)
  },

  AddCategory: async (name: string) => {
    return await axiosInstance.post(API_URL, {
      data: {
        name,
        slug: slugify(name) || 'categorie',
      },
    })
  },

  DeleteCategory: async (documentId: string) => {
    return await axiosInstance.delete(`${API_URL}/${documentId}`)
  },
}
