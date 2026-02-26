import type { Cat } from '@/models/Cat'
import { CatService } from '@/services/catService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCatStore = defineStore('cat', () => {
  const cats = ref<Cat[]>([])

  const fectchCats = async () => {
    try {
      const response = await CatService.GetAllCats()
      cats.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  return {
    cats,
    fectchCats,
  }
})
