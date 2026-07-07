import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlogPost, BlogPostPostPut } from '@/models/BlogPost'
import { BlogPostService, type BlogPostQueryParams } from '@/services/blogPostService'

export const useBlogPostStore = defineStore('blogPost', () => {
  const blogPosts = ref<BlogPost[]>([])
  const selectedBlogPost = ref<BlogPost | null>(null)
  const total = ref(0)
  const page = ref(1)
  const pageSize = ref(10)

  const fetchBlogPosts = async (params: BlogPostQueryParams) => {
    const response = await BlogPostService.GetAdminBlogPosts(params)

    blogPosts.value = response.data.data
    total.value = response.data.meta.pagination.total
    page.value = response.data.meta.pagination.page
    pageSize.value = response.data.meta.pagination.pageSize
  }

  const fetchBlogPostById = async (documentId: string) => {
    const response = await BlogPostService.GetAdminBlogPost(documentId)
    selectedBlogPost.value = response.data.data
  }

  const addBlogPost = async (blogPost: BlogPostPostPut, status: 'draft' | 'published') => {
    await BlogPostService.AddBlogPost(blogPost, status)
  }

  const updateBlogPost = async (
    documentId: string,
    blogPost: BlogPostPostPut,
    status: 'draft' | 'published',
  ) => {
    await BlogPostService.UpdateBlogPost(documentId, blogPost, status)
  }

  const deleteBlogPost = async (documentId: string) => {
    await BlogPostService.DeleteBlogPost(documentId)
  }

  const uploadCover = async (formData: FormData): Promise<number> => {
    const response = await BlogPostService.UploadCover(formData)
    return response.data[0].id
  }

  return {
    blogPosts,
    selectedBlogPost,
    total,
    page,
    pageSize,
    fetchBlogPosts,
    fetchBlogPostById,
    addBlogPost,
    updateBlogPost,
    deleteBlogPost,
    uploadCover,
  }
})
