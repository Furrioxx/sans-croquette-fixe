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
    const response = await BlogCategoryService.AddCategory(name)
    categories.value = [...categories.value, response.data.data].sort((a, b) =>
      a.name.localeCompare(b.name),
    )
  }

  const deleteCategory = async (id: number) => {
    await BlogCategoryService.DeleteCategory(id)
    categories.value = categories.value.filter((category) => category.id !== id)
  }

  return {
    categories,
    fetchCategories,
    addCategory,
    deleteCategory,
  }
})
