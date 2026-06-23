import type { BlogPostPostPut } from '@/models/BlogPost'
import { axiosInstance } from './axiosInsance'

const API_URL = '/blog-posts'

export interface BlogPostQueryParams {
  page: number
  pageSize: number
  search?: string
  status?: 'all' | 'published' | 'draft'
}

export const BlogPostService = {
  GetPublicBlogPosts: async (params: BlogPostQueryParams) => {
    return await axiosInstance.get(API_URL, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
      },
    })
  },

  GetPublicBlogPost: async (identifier: string) => {
    return await axiosInstance.get(`${API_URL}/view/${identifier}`)
  },

  GetAdminBlogPosts: async (params: BlogPostQueryParams) => {
    return await axiosInstance.get(`${API_URL}/admin`, {
      params: {
        page: params.page,
        pageSize: params.pageSize,
        search: params.search,
        status: params.status,
      },
    })
  },

  GetAdminBlogPost: async (documentId: string) => {
    return await axiosInstance.get(`${API_URL}/admin/${documentId}`)
  },

  AddBlogPost: async (blogPost: BlogPostPostPut) => {
    return await axiosInstance.post(`${API_URL}/admin`, { data: blogPost })
  },

  UpdateBlogPost: async (documentId: string, blogPost: BlogPostPostPut) => {
    return await axiosInstance.put(`${API_URL}/admin/${documentId}`, { data: blogPost })
  },

  DeleteBlogPost: async (documentId: string) => {
    return await axiosInstance.delete(`${API_URL}/admin/${documentId}`)
  },

  UploadCover: async (formData: FormData) => {
    return await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
}
