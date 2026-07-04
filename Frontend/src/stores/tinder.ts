import type { Cat, CatMood } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCatSheetStore = defineStore('tinder', () => {
  const likedCatSheets = ref<CatSheet[]>([])
  const dislikedCatSheets = ref<CatSheet[]>([])

  const isUserPreferDuo = computed<boolean>(() => {
    let duo: number = 0
    let notDuo: number = 0

    likedCatSheets.value.forEach((cs) => {
      cs.isDuo ? duo++ : notDuo++
    })

    return duo > notDuo
  })

  // like
  const flattenedLikedCats = computed<Cat[]>(() => likedCatSheets.value.flatMap((cs) => cs.cats))
  const likedMood = computed<CatMood[]>(() =>
    flattenedLikedCats.value.flatMap((cat) => cat.cat_moods),
  )

  // dislike
  const flattenedDislikedCats = computed<Cat[]>(() =>
    dislikedCatSheets.value.flatMap((cs) => cs.cats),
  )
  const dislikedMood = computed<CatMood[]>(() =>
    flattenedDislikedCats.value.flatMap((cat) => cat.cat_moods),
  )

  return {
    likedCatSheets,
    dislikedCatSheets,
    isUserPreferDuo,
    flattenedLikedCats,
    likedMood,
    flattenedDislikedCats,
    dislikedMood,
  }
})
