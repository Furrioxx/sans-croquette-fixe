import type { Cat, CatPostPut } from '@/models/Cat'
import { CatService } from '@/services/catService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCatStore = defineStore('cat', () => {
  const cats = ref<Cat[]>([])
  const selectedCat = ref<Cat | null>(null)

  const fectchCats = async () => {
    try {
      const response = await CatService.GetAllCats()
      cats.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  const addCat = async (cat: CatPostPut) => {
    try {
      await CatService.AddCat(cat)
    } catch (error) {
      throw error
    }
  }

  const updateCat = async (id: string, cat: CatPostPut) => {
    try {
      await CatService.UpdateCat(id, cat)
    } catch (error) {
      throw error
    }
  }

  const uploadImages = async (formData: FormData): Promise<number[]> => {
    try {
      const response = await CatService.UploadImages(formData)
      return response.data.map((file: any) => file.id)
    } catch (error) {
      throw error
    }
  }

  return {
    cats,
    selectedCat,
    fectchCats,
    addCat,
    updateCat,
    uploadImages,
  }
})
