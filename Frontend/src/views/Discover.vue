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

const activeFilterCount = computed(
  () =>
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
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-10 pt-14 text-center sm:px-6 md:px-[60px] md:pb-14"
    >
      <div
        class="pointer-events-none absolute left-1/2 -top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="relative mx-auto max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('discover.nav-link') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ $t('discover.title') }}
        </h1>
        <p class="mx-auto max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('discover.subtitle') }}
        </p>
      </div>
    </section>

    <!-- DECK -->
    <section class="w-full bg-[var(--scf-bg)] px-4 pb-16 sm:px-6 md:px-[60px]">
      <div class="mx-auto w-full max-w-md">
        <div class="flex flex-col gap-3 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
          <Button
            as="router-link"
            :to="{ name: RouteNames.DISCOVER_LIKES }"
            :label="$t('discover.my-likes')"
            icon="pi pi-heart-fill"
            rounded
            size="small"
            class="w-full !bg-white !border-[var(--scf-line)] !text-[var(--scf-ink)] sm:w-auto"
          />

          <Button
            :label="$t('adopt.filter-btn')"
            rounded
            size="small"
            class="w-full sm:w-auto"
            :class="
              activeFilterCount > 0
                ? '!bg-[var(--scf-ink)] !border-[var(--scf-ink)]'
                : '!bg-white !border-[var(--scf-line)] !text-[var(--scf-ink)]'
            "
            @click="filterPanelOpen = !filterPanelOpen"
          >
            <template #default>
              <span class="flex items-center gap-2">
                <i :class="filterPanelOpen ? 'pi pi-times' : 'pi pi-sliders-h'"></i>
                {{ $t('adopt.filter-btn') }}
                <span
                  v-if="activeFilterCount > 0"
                  class="inline-flex h-5 w-5 items-center justify-center rounded-full bg-white/25 text-xs"
                  >{{ activeFilterCount }}</span
                >
              </span>
            </template>
          </Button>
        </div>

        <Transition name="filter-panel">
          <div v-if="filterPanelOpen" class="mb-6 overflow-hidden rounded-[20px] bg-white">
            <div class="flex flex-col gap-6 p-4 sm:p-6">
              <div>
                <p
                  class="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--scf-muted)]"
                >
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
                <p
                  class="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--scf-muted)]"
                >
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
                <p
                  class="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--scf-muted)]"
                >
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

            <div v-if="activeFilterCount > 0" class="px-4 pb-5 sm:px-6">
              <button
                class="text-sm font-semibold text-[var(--scf-accent-dark)] underline underline-offset-2"
                @click="resetFilters"
              >
                {{ $t('adopt.filter-reset') }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- Swipe stack -->
        <div class="discover-deck relative">
          <template v-if="deck.length">
            <TinderCard
              v-for="(card, i) in [...nextCards].reverse()"
              :key="card.documentId"
              :catSheet="card"
              :interactive="false"
              class="scale-95"
              :style="{
                transform: `translateY(${(nextCards.length - i) * 10}px) scale(${1 - (nextCards.length - i) * 0.04})`,
                zIndex: i,
              }"
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
            class="absolute inset-0 flex items-center justify-center rounded-[26px] bg-white"
          >
            <i class="pi pi-spin pi-spinner text-3xl text-[var(--scf-accent-dark)]"></i>
          </div>

          <div
            v-else
            class="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[26px] bg-white p-8 text-center"
          >
            <div
              class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]"
            >
              <i class="pi pi-heart text-3xl text-[var(--scf-accent-dark)]"></i>
            </div>
            <h3 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
              {{ $t('discover.no-more') }}
            </h3>
            <p class="text-sm text-[var(--scf-muted)]">{{ $t('discover.no-more-sub') }}</p>
            <Button
              v-if="activeFilterCount > 0"
              :label="$t('adopt.filter-reset')"
              rounded
              outlined
              severity="secondary"
              size="small"
              class="!border-[var(--scf-line)] !text-[var(--scf-ink)]"
              @click="resetFilters"
            />
          </div>
        </div>

        <!-- Details of the currently shown card -->
        <div v-if="currentCard" class="mt-4 rounded-[26px] bg-white p-4 sm:p-6">
          <CatSheetDetails :catSheet="currentCard" :truncateDescription="false" />
        </div>

        <!-- Action buttons -->
        <div v-if="currentCard" class="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          <button
            :aria-label="$t('discover.pass')"
            data-cy="discover-pass"
            class="flex h-12 w-12 items-center justify-center rounded-full bg-white text-lg text-[var(--scf-danger)] transition-transform hover:scale-105 sm:h-16 sm:w-16 sm:text-2xl"
            @click="topCardRef?.triggerPass()"
          >
            <i class="pi pi-times"></i>
          </button>
          <button
            :aria-label="$t('discover.like')"
            data-cy="discover-like"
            class="flex h-14 w-14 items-center justify-center rounded-full bg-white text-xl text-[var(--scf-accent)] transition-transform hover:scale-105 sm:h-16 sm:w-16 sm:text-2xl"
            @click="topCardRef?.triggerLike()"
          >
            <i class="pi pi-heart-fill"></i>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.filter-panel-enter-active,
.filter-panel-leave-active {
  transition:
    max-height 0.3s ease,
    opacity 0.3s ease;
  max-height: 600px;
}
.filter-panel-enter-from,
.filter-panel-leave-to {
  max-height: 0;
  opacity: 0;
}
</style>
