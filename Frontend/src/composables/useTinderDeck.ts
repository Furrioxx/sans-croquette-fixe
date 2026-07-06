import type { CatSheet } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import { useTinderStore } from '@/stores/tinder'
import { scoreCatSheet, weightedShuffle } from '@/utils/tinderRanking'
import { computed, ref, watch } from 'vue'

const PAGE_SIZE = 10
const MIN_DECK_SIZE = 5
const MAX_EMPTY_PAGES_IN_A_ROW = 2
const MIN_HISTORY_FOR_RANKING = 3

export function useTinderDeck() {
  const tinderStore = useTinderStore()

  const filterGenders = ref<string[]>([])
  const filterIsDuo = ref(false)
  const filterCatFriendly = ref(false)
  const filterDogFriendly = ref(false)
  const filterChildFriendly = ref(false)
  const filterVaccinated = ref(false)
  const filterSterilized = ref(false)
  const filterIdentified = ref(false)
  const filterDecontaminate = ref(false)

  const deck = ref<CatSheet[]>([])
  const loading = ref(false)
  const exhausted = ref(false)
  const page = ref(1)
  const emptyPagesInARow = ref(0)

  const currentCard = computed(() => deck.value[0] ?? null)
  const nextCards = computed(() => deck.value.slice(1, 3))

  const buildPreferences = () => ({
    hasEnoughHistory: tinderStore.likedCatSheets.length >= MIN_HISTORY_FOR_RANKING,
    likedMoodIds: new Set(tinderStore.likedMood.map((m) => m.documentId)),
    dislikedMoodIds: new Set(tinderStore.dislikedMood.map((m) => m.documentId)),
    preferDuo: tinderStore.isUserPreferDuo,
    likedTraitRates: tinderStore.likedTraitRates,
    dislikedTraitRates: tinderStore.dislikedTraitRates,
    preferredStatuses: tinderStore.preferredStatuses,
  })

  const fetchNextBatch = async () => {
    if (loading.value || exhausted.value) return
    loading.value = true
    try {
      const excludeIds = [...tinderStore.swipedIds, ...deck.value.map((cs) => cs.documentId)]
      const response = await CatSheetService.GetPublicCatSheets({
        page: page.value,
        pageSize: PAGE_SIZE,
        genders: filterGenders.value.length ? filterGenders.value : undefined,
        isDuo: filterIsDuo.value || undefined,
        catFriendly: filterCatFriendly.value || undefined,
        dogFriendly: filterDogFriendly.value || undefined,
        childFriendly: filterChildFriendly.value || undefined,
        vaccinated: filterVaccinated.value || undefined,
        sterilized: filterSterilized.value || undefined,
        identified: filterIdentified.value || undefined,
        decontaminate: filterDecontaminate.value || undefined,
        excludeIds,
      })

      const sheets: CatSheet[] = response.data.data
      page.value += 1

      if (!sheets.length) {
        emptyPagesInARow.value += 1
        if (emptyPagesInARow.value >= MAX_EMPTY_PAGES_IN_A_ROW) exhausted.value = true
        return
      }
      emptyPagesInARow.value = 0

      const prefs = buildPreferences()
      const scores = sheets.map((sheet) => scoreCatSheet(sheet, prefs))
      deck.value.push(...weightedShuffle(sheets, scores))
    } finally {
      loading.value = false
    }
  }

  const ensureDeckFilled = () => {
    if (deck.value.length < MIN_DECK_SIZE && !exhausted.value) fetchNextBatch()
  }

  const like = () => {
    const card = currentCard.value
    if (!card) return
    deck.value.shift()
    tinderStore.likeCatSheet(card)
    ensureDeckFilled()
  }

  const pass = () => {
    const card = currentCard.value
    if (!card) return
    deck.value.shift()
    tinderStore.dislikeCatSheet(card)
    ensureDeckFilled()
  }

  const resetDeck = () => {
    deck.value = []
    page.value = 1
    emptyPagesInARow.value = 0
    exhausted.value = false
    fetchNextBatch()
  }

  const filterSnapshot = computed(() =>
    JSON.stringify({
      filterGenders: filterGenders.value,
      filterIsDuo: filterIsDuo.value,
      filterCatFriendly: filterCatFriendly.value,
      filterDogFriendly: filterDogFriendly.value,
      filterChildFriendly: filterChildFriendly.value,
      filterVaccinated: filterVaccinated.value,
      filterSterilized: filterSterilized.value,
      filterIdentified: filterIdentified.value,
      filterDecontaminate: filterDecontaminate.value,
    }),
  )

  watch(filterSnapshot, resetDeck)

  return {
    filterGenders,
    filterIsDuo,
    filterCatFriendly,
    filterDogFriendly,
    filterChildFriendly,
    filterVaccinated,
    filterSterilized,
    filterIdentified,
    filterDecontaminate,
    deck,
    currentCard,
    nextCards,
    loading,
    exhausted,
    like,
    pass,
    resetDeck,
  }
}
