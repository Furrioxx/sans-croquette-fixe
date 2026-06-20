<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import type { PublicCatSheetParams } from '@/services/catSheetService'
import CatSheetCard from '@/components/CatSheetCard.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const PAGE_SIZE = 9

// --- state ---
const catSheets = ref<CatSheet[]>([])
const totalRecords = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const filterPanelOpen = ref(false)

// filter state
const filterStatuses = ref<string[]>([])
const filterGenders = ref<string[]>([])
const filterIsDuo = ref(false)
const filterCatFriendly = ref(false)
const filterDogFriendly = ref(false)
const filterChildFriendly = ref(false)
const filterVaccinated = ref(false)
const filterSterilized = ref(false)
const filterIdentified = ref(false)
const filterDecontaminate = ref(false)

// active filter chips (for display below toolbar)
const activeFilters = computed(() => {
  const chips: { key: string; label: string }[] = []
  filterStatuses.value.forEach((s) => {
    const label = s === 'en_refuge' ? t('adopt.filter-refuge') : t('adopt.filter-accueil')
    chips.push({ key: `status-${s}`, label })
  })
  filterGenders.value.forEach((g) => {
    const label = g === 'male' ? t('adopt.filter-male') : t('adopt.filter-female')
    chips.push({ key: `gender-${g}`, label })
  })
  if (filterIsDuo.value) chips.push({ key: 'duo', label: t('adopt.filter-duo') })
  if (filterCatFriendly.value) chips.push({ key: 'catFriendly', label: t('adopt.filter-cat-friendly') })
  if (filterDogFriendly.value) chips.push({ key: 'dogFriendly', label: t('adopt.filter-dog-friendly') })
  if (filterChildFriendly.value) chips.push({ key: 'childFriendly', label: t('adopt.filter-child-friendly') })
  if (filterVaccinated.value) chips.push({ key: 'vaccinated', label: t('adopt.filter-vaccinated') })
  if (filterSterilized.value) chips.push({ key: 'sterilized', label: t('adopt.filter-sterilized') })
  if (filterIdentified.value) chips.push({ key: 'identified', label: t('adopt.filter-identified') })
  if (filterDecontaminate.value) chips.push({ key: 'decontaminate', label: t('adopt.filter-decontaminated') })
  return chips
})

const activeFilterCount = computed(() => activeFilters.value.length)

const removeFilter = (key: string) => {
  if (key.startsWith('status-')) {
    const s = key.replace('status-', '')
    filterStatuses.value = filterStatuses.value.filter((x) => x !== s)
  } else if (key.startsWith('gender-')) {
    const g = key.replace('gender-', '')
    filterGenders.value = filterGenders.value.filter((x) => x !== g)
  } else if (key === 'duo') filterIsDuo.value = false
  else if (key === 'catFriendly') filterCatFriendly.value = false
  else if (key === 'dogFriendly') filterDogFriendly.value = false
  else if (key === 'childFriendly') filterChildFriendly.value = false
  else if (key === 'vaccinated') filterVaccinated.value = false
  else if (key === 'sterilized') filterSterilized.value = false
  else if (key === 'identified') filterIdentified.value = false
  else if (key === 'decontaminate') filterDecontaminate.value = false
}

const resetFilters = () => {
  filterStatuses.value = []
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

// --- data fetch ---
const fetchCatSheets = async () => {
  loading.value = true
  try {
    const params: PublicCatSheetParams = {
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      statuses: filterStatuses.value.length ? filterStatuses.value : undefined,
      genders: filterGenders.value.length ? filterGenders.value : undefined,
      isDuo: filterIsDuo.value || undefined,
      catFriendly: filterCatFriendly.value || undefined,
      dogFriendly: filterDogFriendly.value || undefined,
      childFriendly: filterChildFriendly.value || undefined,
      vaccinated: filterVaccinated.value || undefined,
      sterilized: filterSterilized.value || undefined,
      identified: filterIdentified.value || undefined,
      decontaminate: filterDecontaminate.value || undefined,
    }
    const response = await CatSheetService.GetPublicCatSheets(params)
    catSheets.value = response.data.data
    totalRecords.value = response.data.meta?.pagination?.total ?? 0
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

// reset page and refetch when filters change
const filterSnapshot = computed(() => JSON.stringify({
  filterStatuses: filterStatuses.value,
  filterGenders: filterGenders.value,
  filterIsDuo: filterIsDuo.value,
  filterCatFriendly: filterCatFriendly.value,
  filterDogFriendly: filterDogFriendly.value,
  filterChildFriendly: filterChildFriendly.value,
  filterVaccinated: filterVaccinated.value,
  filterSterilized: filterSterilized.value,
  filterIdentified: filterIdentified.value,
  filterDecontaminate: filterDecontaminate.value,
}))

watch(filterSnapshot, () => {
  currentPage.value = 1
  fetchCatSheets()
})

watch(currentPage, fetchCatSheets)

onMounted(fetchCatSheets)

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">

    <!-- Hero header -->
    <div class="bg-gradient-to-b from-primary-50 to-surface-50 dark:from-primary-950/20 dark:to-surface-900 pt-12 pb-8 px-4 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-50 tracking-tight">
        {{ $t('adopt.title') }}
      </h1>
      <p class="mt-3 text-lg text-surface-500 dark:text-surface-400">
        {{ $t('adopt.subtitle') }}
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">

      <!-- Toolbar -->
      <div class="flex items-center justify-between py-5 gap-4 flex-wrap">
        <span class="text-surface-500 dark:text-surface-400 text-sm">
          <template v-if="!loading">{{ $t('adopt.results', { n: totalRecords }) }}</template>
          <template v-else><i class="pi pi-spin pi-spinner text-xs mr-1"></i> Chargement…</template>
        </span>

        <Button
          :icon="filterPanelOpen ? 'pi pi-times' : 'pi pi-sliders-h'"
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

      <!-- Collapsible filter panel -->
      <Transition name="filter-panel">
        <div
          v-if="filterPanelOpen"
          class="bg-white dark:bg-surface-800 rounded-2xl border border-surface-200 dark:border-surface-700 shadow-sm mb-6 overflow-hidden"
        >
          <div class="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

            <!-- Statut -->
            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-status') }}
              </p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterStatuses" value="en_refuge" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-refuge') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterStatuses" value="en_famille_accueil" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-accueil') }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Profil -->
            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-profile') }}
              </p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterIsDuo" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-duo') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterGenders" value="male" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-male') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterGenders" value="female" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-female') }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Ententes -->
            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-compatible') }}
              </p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterCatFriendly" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-cat-friendly') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterDogFriendly" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-dog-friendly') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterChildFriendly" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-child-friendly') }}
                  </span>
                </label>
              </div>
            </div>

            <!-- Santé -->
            <div>
              <p class="text-xs font-semibold text-surface-400 dark:text-surface-500 uppercase tracking-wider mb-3">
                {{ $t('adopt.filter-health') }}
              </p>
              <div class="flex flex-col gap-2">
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterVaccinated" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-vaccinated') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterSterilized" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-sterilized') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterIdentified" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-identified') }}
                  </span>
                </label>
                <label class="flex items-center gap-2 cursor-pointer group/cb">
                  <Checkbox v-model="filterDecontaminate" :binary="true" />
                  <span class="text-sm text-surface-700 dark:text-surface-300 group-hover/cb:text-primary-600 transition-colors">
                    {{ $t('adopt.filter-decontaminated') }}
                  </span>
                </label>
              </div>
            </div>
          </div>

          <!-- Reset link -->
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

      <!-- Active filter chips -->
      <div v-if="activeFilters.length" class="flex flex-wrap gap-2 mb-6">
        <span
          v-for="chip in activeFilters"
          :key="chip.key"
          class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
        >
          {{ chip.label }}
          <button
            class="ml-0.5 text-primary-400 hover:text-primary-600 transition-colors"
            @click="removeFilter(chip.key)"
            aria-label="Retirer ce filtre"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
      </div>

      <!-- Loading skeleton -->
      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in PAGE_SIZE"
          :key="i"
          class="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700 animate-pulse"
        >
          <div class="aspect-[4/3] bg-surface-200 dark:bg-surface-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            <div class="h-4 bg-surface-100 dark:bg-surface-600 rounded w-1/3"></div>
            <div class="space-y-2">
              <div class="h-3 bg-surface-100 dark:bg-surface-600 rounded"></div>
              <div class="h-3 bg-surface-100 dark:bg-surface-600 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="catSheets.length === 0"
        class="flex flex-col items-center justify-center py-24 gap-4 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <i class="pi pi-heart text-3xl text-primary-300 dark:text-primary-600"></i>
        </div>
        <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300">
          {{ $t('adopt.no-cats') }}
        </h3>
        <p class="text-surface-400 dark:text-surface-500 text-sm">{{ $t('adopt.no-cats-sub') }}</p>
        <Button
          v-if="activeFilterCount > 0"
          :label="$t('adopt.filter-reset')"
          severity="secondary"
          outlined
          size="small"
          @click="resetFilters"
        />
      </div>

      <!-- Card grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <CatSheetCard
          v-for="catSheet in catSheets"
          :key="catSheet.documentId"
          :catSheet="catSheet"
        />
      </div>

      <!-- Pagination -->
      <div v-if="totalRecords > PAGE_SIZE" class="mt-12 flex justify-center">
        <Paginator
          :rows="PAGE_SIZE"
          :totalRecords="totalRecords"
          :first="(currentPage - 1) * PAGE_SIZE"
          @page="onPageChange"
          :rowsPerPageOptions="[]"
        />
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
