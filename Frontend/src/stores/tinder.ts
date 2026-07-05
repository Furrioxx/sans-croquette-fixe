import type { Cat, CatMood } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import { localStorageHelper } from '@/utils/localStorageHelper'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const LIKED_IDS_KEY = 'tinder-liked-ids'
const DISLIKED_IDS_KEY = 'tinder-disliked-ids'

type TraitKey =
  | 'catFriendly'
  | 'dogFriendly'
  | 'childFriendly'
  | 'vaccinated'
  | 'sterilized'
  | 'identified'
  | 'decontaminate'

const traitIsPositive = (cat: Cat, trait: TraitKey): boolean => {
  const value = cat[trait]
  return value === true || value === 'yes'
}

const computeTraitRates = (cats: Cat[]): Record<TraitKey, number> => {
  const traits: TraitKey[] = [
    'catFriendly',
    'dogFriendly',
    'childFriendly',
    'vaccinated',
    'sterilized',
    'identified',
    'decontaminate',
  ]
  const rates = {} as Record<TraitKey, number>
  traits.forEach((trait) => {
    rates[trait] = cats.length
      ? cats.filter((cat) => traitIsPositive(cat, trait)).length / cats.length
      : 0
  })
  return rates
}

export const useTinderStore = defineStore('tinder', () => {
  const likedCatSheets = ref<CatSheet[]>([])
  const dislikedCatSheets = ref<CatSheet[]>([])

  const persistIds = () => {
    localStorageHelper.storeData(
      LIKED_IDS_KEY,
      likedCatSheets.value.map((cs) => cs.documentId),
    )
    localStorageHelper.storeData(
      DISLIKED_IDS_KEY,
      dislikedCatSheets.value.map((cs) => cs.documentId),
    )
  }

  const likeCatSheet = (catSheet: CatSheet) => {
    if (likedCatSheets.value.some((cs) => cs.documentId === catSheet.documentId)) return
    dislikedCatSheets.value = dislikedCatSheets.value.filter(
      (cs) => cs.documentId !== catSheet.documentId,
    )
    likedCatSheets.value.push(catSheet)
    persistIds()
  }

  const dislikeCatSheet = (catSheet: CatSheet) => {
    if (dislikedCatSheets.value.some((cs) => cs.documentId === catSheet.documentId)) return
    likedCatSheets.value = likedCatSheets.value.filter(
      (cs) => cs.documentId !== catSheet.documentId,
    )
    dislikedCatSheets.value.push(catSheet)
    persistIds()
  }

  const unlikeCatSheet = (documentId: string) => {
    likedCatSheets.value = likedCatSheets.value.filter((cs) => cs.documentId !== documentId)
    persistIds()
  }

  const swipedIds = computed<Set<string>>(
    () =>
      new Set([
        ...likedCatSheets.value.map((cs) => cs.documentId),
        ...dislikedCatSheets.value.map((cs) => cs.documentId),
      ]),
  )

  const hydrate = async () => {
    const likedIds: string[] = localStorageHelper.getData(LIKED_IDS_KEY) ?? []
    const dislikedIds: string[] = localStorageHelper.getData(DISLIKED_IDS_KEY) ?? []
    const allIds = [...likedIds, ...dislikedIds]
    if (!allIds.length) return

    const response = await CatSheetService.GetCatSheetsByIds(allIds)
    const sheets: CatSheet[] = response.data.data
    const byId = new Map(sheets.map((cs) => [cs.documentId, cs]))

    likedCatSheets.value = likedIds.map((id) => byId.get(id)).filter((cs): cs is CatSheet => !!cs)
    dislikedCatSheets.value = dislikedIds
      .map((id) => byId.get(id))
      .filter((cs): cs is CatSheet => !!cs)
  }

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

  const likedTraitRates = computed(() => computeTraitRates(flattenedLikedCats.value))
  const dislikedTraitRates = computed(() => computeTraitRates(flattenedDislikedCats.value))

  const preferredStatuses = computed<Record<string, number>>(() => {
    const counts: Record<string, number> = {}
    flattenedLikedCats.value.forEach((cat) => {
      if (!cat.catStatus) return
      counts[cat.catStatus] = (counts[cat.catStatus] ?? 0) + 1
    })
    return counts
  })

  return {
    likedCatSheets,
    dislikedCatSheets,
    likeCatSheet,
    dislikeCatSheet,
    unlikeCatSheet,
    swipedIds,
    hydrate,
    isUserPreferDuo,
    flattenedLikedCats,
    likedMood,
    flattenedDislikedCats,
    dislikedMood,
    likedTraitRates,
    dislikedTraitRates,
    preferredStatuses,
  }
})
