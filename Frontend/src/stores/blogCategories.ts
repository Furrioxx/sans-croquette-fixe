import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { BlogCategory } from '@/models/BlogCategory'
import { BlogCategoryService } from '@/services/blogCategoryService'

export const useBlogCategoryStore = defineStore('blogCategory', () => {
  const categories = ref<BlogCategory[]>([])

  const fetchCategories = async () => {
    const response = await BlogCategoryService.GetAdminCategories()
    categories.value = response.data.data
  }

  const addCategory = async (name: string) => {
    await BlogCategoryService.AddCategory(name)
    await fetchCategories()
  }

  const deleteCategory = async (documentId: string) => {
    await BlogCategoryService.DeleteCategory(documentId)
    categories.value = categories.value.filter((category) => category.documentId !== documentId)
  }

  return {
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
  }
})
