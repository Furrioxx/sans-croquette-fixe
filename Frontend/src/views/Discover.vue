<script setup lang="ts">
import CatSheetDetails from '@/components/CatSheetDetails.vue'
import CheckboxWithLabel from '@/components/Forms/elements/CheckboxWithLabel.vue'
import TinderCard from '@/components/TinderCard.vue'
import { useTinderDeck } from '@/composables/useTinderDeck'
import { RouteNames } from '@/router/routeNames'
import { useTinderStore } from '@/stores/tinder'
import { computed, onMounted, onUnmounted, ref } from 'vue'

const tinderStore = useTinderStore()
const {
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
} = useTinderDeck()

const filterPanelOpen = ref(false)

const activeFilterCount = computed(() =>
  [
    filterGenders.value.length > 0,
    filterIsDuo.value,
    filterCatFriendly.value,
    filterDogFriendly.value,
    filterChildFriendly.value,
    filterVaccinated.value,
    filterSterilized.value,
    filterIdentified.value,
    filterDecontaminate.value,
  ].filter(Boolean).length,
)

const resetFilters = () => {
  filterGenders.value = []
  filterIsDuo.value = false
  filterCatFriendly.value = false
  filterDogFriendly.value = false
  filterChildFriendly.value = false
  filterVaccinated.value = false
  filterSterilized.value = false
  filterIdentified.value = false
  filterDecontaminate.value = false
}

const topCardRef = ref<InstanceType<typeof TinderCard> | null>(null)

const onKeydown = (event: KeyboardEvent) => {
  if (!currentCard.value) return
  if (event.key === 'ArrowRight') topCardRef.value?.triggerLike()
  else if (event.key === 'ArrowLeft') topCardRef.value?.triggerPass()
}

onMounted(async () => {
  await tinderStore.hydrate()
  resetDeck()
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <div class="bg-gradient-to-b from-primary-50 to-surface-50 dark:from-primary-950/20 dark:to-surface-900 pt-12 pb-8 px-4 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-50 tracking-tight">
        {{ $t('discover.title') }}
      </h1>
      <p class="mt-3 text-lg text-surface-500 dark:text-surface-400">
        {{ $t('discover.subtitle') }}
      </p>
    </div>

    <div class="max-w-md mx-auto px-4 pb-16">
      <div class="flex items-center justify-between py-5 gap-4">
        <Button
          as="router-link"
          :to="{ name: RouteNames.DISCOVER_LIKES }"
          :label="$t('discover.my-likes')"
          icon="pi pi-heart-fill"
          severity="secondary"
          outlined
          size="small"
        />

        <Button
          :label="$t('adopt.filter-btn')"
          :severity="activeFilterCount > 0 ? 'info' : 'secondary'"
          :outlined="activeFilterCount === 0"
          size="small"
          @click="filterPanelOpen = !filterPanelOpen"
        >
          <template #default>
            <span class="flex items-center gap-2">
              <i :class="filterPanelOpen ? 'pi pi-times' : 'pi pi-sliders-h'"></i>
              {{ $t('adopt.filter-btn') }}
              <span
                v-if="activeFilterCount > 0"
                class="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/30"
              >{{ activeFilterCount }}</span>
            </span>
          </template>
        </Button>
      </div>

      <Transition name="filter-panel">
        <div
          v-if="filterPanelOpen"
          class="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm mb-6 overflow-hidden"
        >
          <div class="p-6 flex flex-col gap-6">
            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-profile') }}
              </p>
              <div class="flex flex-col gap-2">
                <CheckboxWithLabel
                  name="discover-duo"
                  v-model="filterIsDuo"
                  :binary="true"
                  :label="$t('adopt.filter-duo')"
                />
                <CheckboxWithLabel
                  name="discover-gender-male"
                  v-model="filterGenders"
                  value="male"
                  :label="$t('adopt.filter-male')"
                />
                <CheckboxWithLabel
                  name="discover-gender-female"
                  v-model="filterGenders"
                  value="female"
                  :label="$t('adopt.filter-female')"
                />
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-compatible') }}
              </p>
              <div class="flex flex-col gap-2">
                <CheckboxWithLabel
                  name="discover-cat-friendly"
                  v-model="filterCatFriendly"
                  :binary="true"
                  :label="$t('adopt.filter-cat-friendly')"
                />
                <CheckboxWithLabel
                  name="discover-dog-friendly"
                  v-model="filterDogFriendly"
                  :binary="true"
                  :label="$t('adopt.filter-dog-friendly')"
                />
                <CheckboxWithLabel
                  name="discover-child-friendly"
                  v-model="filterChildFriendly"
                  :binary="true"
                  :label="$t('adopt.filter-child-friendly')"
                />
              </div>
            </div>

            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-health') }}
              </p>
              <div class="flex flex-col gap-2">
                <CheckboxWithLabel
                  name="discover-vaccinated"
                  v-model="filterVaccinated"
                  :binary="true"
                  :label="$t('adopt.filter-vaccinated')"
                />
                <CheckboxWithLabel
                  name="discover-sterilized"
                  v-model="filterSterilized"
                  :binary="true"
                  :label="$t('adopt.filter-sterilized')"
                />
                <CheckboxWithLabel
                  name="discover-identified"
                  v-model="filterIdentified"
                  :binary="true"
                  :label="$t('adopt.filter-identified')"
                />
                <CheckboxWithLabel
                  name="discover-decontaminate"
                  v-model="filterDecontaminate"
                  :binary="true"
                  :label="$t('adopt.filter-decontaminated')"
                />
              </div>
            </div>
          </div>

          <div v-if="activeFilterCount > 0" class="px-6 pb-4">
            <button
              class="text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 underline underline-offset-2 transition-colors"
              @click="resetFilters"
            >
              {{ $t('adopt.filter-reset') }}
            </button>
          </div>
        </div>
      </Transition>

      <!-- Swipe stack -->
      <div class="relative h-[520px]">
        <template v-if="deck.length">
          <TinderCard
            v-for="(card, i) in [...nextCards].reverse()"
            :key="card.documentId"
            :catSheet="card"
            :interactive="false"
            class="scale-95"
            :style="{ transform: `translateY(${(nextCards.length - i) * 10}px) scale(${1 - (nextCards.length - i) * 0.04})`, zIndex: i }"
          />
          <TinderCard
            v-if="currentCard"
            ref="topCardRef"
            :key="currentCard.documentId"
            :catSheet="currentCard"
            class="z-10"
            @like="like"
            @pass="pass"
          />
        </template>

        <div
          v-else-if="loading && !exhausted"
          class="absolute inset-0 flex items-center justify-center rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700"
        >
          <i class="pi pi-spin pi-spinner text-3xl text-primary-400"></i>
        </div>

        <div
          v-else
          class="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center rounded-2xl bg-white dark:bg-surface-800 border border-surface-100 dark:border-surface-700 p-8"
        >
          <div class="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
            <i class="pi pi-heart text-3xl text-primary-300 dark:text-primary-600"></i>
          </div>
          <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300">
            {{ $t('discover.no-more') }}
          </h3>
          <p class="text-surface-400 dark:text-surface-500 text-sm">{{ $t('discover.no-more-sub') }}</p>
          <Button
            v-if="activeFilterCount > 0"
            :label="$t('adopt.filter-reset')"
            severity="secondary"
            outlined
            size="small"
            @click="resetFilters"
          />
        </div>
      </div>

      <!-- Details of the currently shown card -->
      <div
        v-if="currentCard"
        class="mt-4 bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm p-5"
      >
        <CatSheetDetails :catSheet="currentCard" :truncateDescription="false" />
      </div>

      <!-- Action buttons -->
      <div v-if="currentCard" class="flex items-center justify-center gap-6 mt-8">
        <button
          :aria-label="$t('discover.pass')"
          class="w-16 h-16 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center text-red-500 text-2xl hover:scale-105 transition-transform"
          @click="topCardRef?.triggerPass()"
        >
          <i class="pi pi-times"></i>
        </button>
        <button
          :aria-label="$t('discover.like')"
          class="w-16 h-16 rounded-full bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 shadow-sm flex items-center justify-center text-green-500 text-2xl hover:scale-105 transition-transform"
          @click="topCardRef?.triggerLike()"
        >
          <i class="pi pi-heart-fill"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.filter-panel-enter-active,
.filter-panel-leave-active {
  transition: max-height 0.3s ease, opacity 0.3s ease;
  max-height: 600px;
}
.filter-panel-enter-from,
.filter-panel-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
