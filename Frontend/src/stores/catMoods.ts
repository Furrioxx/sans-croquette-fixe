import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CatMood } from '@/models/Cat'
import { CatMoodService } from '@/services/catMoodService'

export const useCatMoodStore = defineStore('catMood', () => {
  const catMoods = ref<CatMood[]>([])

  const fectchCatMoods = async () => {
    try {
      const response = await CatMoodService.GetAllCatMoods()
      catMoods.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  return {
    catMoods,
    fectchCatMoods,
  }
})
