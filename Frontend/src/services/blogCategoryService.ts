import { axiosInstance } from './axiosInsance'

const API_URL = '/blog-categories'

export const BlogCategoryService = {
  GetPublicCategories: async () => {
    return await axiosInstance.get(API_URL)
  },

  GetAdminCategories: async () => {
    return await axiosInstance.get(`${API_URL}/admin`)
  },

  AddCategory: async (name: string) => {
    return await axiosInstance.post(`${API_URL}/admin`, { data: { name } })
  },

  DeleteCategory: async (id: number) => {
    return await axiosInstance.delete(`${API_URL}/admin/${id}`)
  },
}
