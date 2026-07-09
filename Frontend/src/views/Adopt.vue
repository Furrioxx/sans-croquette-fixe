<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import type { PublicCatSheetParams } from '@/services/catSheetService'
import CatSheetCard from '@/components/CatSheetCard.vue'
import CheckboxWithLabel from '@/components/Forms/elements/CheckboxWithLabel.vue'
import { ref, computed, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const PAGE_SIZE = 9

const catSheets = ref<CatSheet[]>([])
const totalRecords = ref(0)
const currentPage = ref(1)
const loading = ref(false)
const filterPanelOpen = ref(false)

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
  if (filterCatFriendly.value)
    chips.push({ key: 'catFriendly', label: t('adopt.filter-cat-friendly') })
  if (filterDogFriendly.value)
    chips.push({ key: 'dogFriendly', label: t('adopt.filter-dog-friendly') })
  if (filterChildFriendly.value)
    chips.push({ key: 'childFriendly', label: t('adopt.filter-child-friendly') })
  if (filterVaccinated.value) chips.push({ key: 'vaccinated', label: t('adopt.filter-vaccinated') })
  if (filterSterilized.value) chips.push({ key: 'sterilized', label: t('adopt.filter-sterilized') })
  if (filterIdentified.value) chips.push({ key: 'identified', label: t('adopt.filter-identified') })
  if (filterDecontaminate.value)
    chips.push({ key: 'decontaminate', label: t('adopt.filter-decontaminated') })
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
const filterSnapshot = computed(() =>
  JSON.stringify({
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
  }),
)

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
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-6 pb-10 pt-14 md:px-[60px] md:pb-14"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-32 h-[300px] w-[300px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('adopt.nav-link') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ $t('adopt.title') }}
        </h1>
        <p class="max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('adopt.subtitle') }}
        </p>
      </div>
    </section>

    <!-- TOOLBAR + FILTERS + GRID -->
    <section class="w-full bg-[var(--scf-bg)] px-6 pb-16 md:px-[60px]">
      <div class="page-shell">
        <div class="flex flex-wrap items-center justify-between gap-4 pb-6">
          <span class="text-sm text-[var(--scf-muted)]">
            <template v-if="!loading">{{ $t('adopt.results', { n: totalRecords }) }}</template>
            <template v-else
              ><i class="pi pi-spin pi-spinner mr-1 text-xs"></i> Chargement…</template
            >
          </span>

          <Button
            :label="$t('adopt.filter-btn')"
            rounded
            size="small"
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

        <!-- Collapsible filter panel -->
        <Transition name="filter-panel">
          <div v-if="filterPanelOpen" class="mb-6 overflow-hidden rounded-[20px] bg-white">
            <div class="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <p
                  class="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--scf-muted)]"
                >
                  {{ $t('adopt.filter-status') }}
                </p>
                <div class="flex flex-col gap-2">
                  <CheckboxWithLabel
                    name="adopt-status-refuge"
                    v-model="filterStatuses"
                    value="en_refuge"
                    :label="$t('adopt.filter-refuge')"
                  />
                  <CheckboxWithLabel
                    name="adopt-status-accueil"
                    v-model="filterStatuses"
                    value="en_famille_accueil"
                    :label="$t('adopt.filter-accueil')"
                  />
                </div>
              </div>

              <div>
                <p
                  class="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--scf-muted)]"
                >
                  {{ $t('adopt.filter-profile') }}
                </p>
                <div class="flex flex-col gap-2">
                  <CheckboxWithLabel
                    name="adopt-duo"
                    v-model="filterIsDuo"
                    :binary="true"
                    :label="$t('adopt.filter-duo')"
                  />
                  <CheckboxWithLabel
                    name="adopt-gender-male"
                    v-model="filterGenders"
                    value="male"
                    :label="$t('adopt.filter-male')"
                  />
                  <CheckboxWithLabel
                    name="adopt-gender-female"
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
                    name="adopt-cat-friendly"
                    v-model="filterCatFriendly"
                    :binary="true"
                    :label="$t('adopt.filter-cat-friendly')"
                  />
                  <CheckboxWithLabel
                    name="adopt-dog-friendly"
                    v-model="filterDogFriendly"
                    :binary="true"
                    :label="$t('adopt.filter-dog-friendly')"
                  />
                  <CheckboxWithLabel
                    name="adopt-child-friendly"
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
                    name="adopt-vaccinated"
                    v-model="filterVaccinated"
                    :binary="true"
                    :label="$t('adopt.filter-vaccinated')"
                  />
                  <CheckboxWithLabel
                    name="adopt-sterilized"
                    v-model="filterSterilized"
                    :binary="true"
                    :label="$t('adopt.filter-sterilized')"
                  />
                  <CheckboxWithLabel
                    name="adopt-identified"
                    v-model="filterIdentified"
                    :binary="true"
                    :label="$t('adopt.filter-identified')"
                  />
                  <CheckboxWithLabel
                    name="adopt-decontaminate"
                    v-model="filterDecontaminate"
                    :binary="true"
                    :label="$t('adopt.filter-decontaminated')"
                  />
                </div>
              </div>
            </div>

            <div v-if="activeFilterCount > 0" class="px-6 pb-5">
              <button
                class="text-sm font-semibold text-[var(--scf-accent-dark)] underline underline-offset-2"
                @click="resetFilters"
              >
                {{ $t('adopt.filter-reset') }}
              </button>
            </div>
          </div>
        </Transition>

        <!-- Active filter chips -->
        <div v-if="activeFilters.length" class="mb-6 flex flex-wrap gap-2">
          <span
            v-for="chip in activeFilters"
            :key="chip.key"
            class="inline-flex items-center gap-1.5 rounded-full bg-[var(--scf-accent-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--scf-accent-dark)]"
          >
            {{ chip.label }}
            <button
              class="text-[var(--scf-accent-dark)]/70 hover:text-[var(--scf-accent-dark)]"
              @click="removeFilter(chip.key)"
              aria-label="Retirer ce filtre"
            >
              <i class="pi pi-times text-xs"></i>
            </button>
          </span>
        </div>

        <!-- Loading skeleton -->
        <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="i in PAGE_SIZE"
            :key="i"
            class="animate-pulse overflow-hidden rounded-[22px] bg-white"
          >
            <div class="aspect-[4/3] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-4 w-1/2 rounded bg-[var(--scf-accent-soft)]"></div>
              <div class="h-3 w-1/3 rounded bg-[var(--scf-bg)]"></div>
              <div class="space-y-2">
                <div class="h-3 rounded bg-[var(--scf-bg)]"></div>
                <div class="h-3 w-5/6 rounded bg-[var(--scf-bg)]"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div
          v-else-if="catSheets.length === 0"
          class="flex flex-col items-center justify-center gap-4 rounded-[22px] bg-white px-6 py-24 text-center"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]"
          >
            <i class="pi pi-heart text-3xl text-[var(--scf-accent-dark)]"></i>
          </div>
          <h3 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
            {{ $t('adopt.no-cats') }}
          </h3>
          <p class="text-sm text-[var(--scf-muted)]">{{ $t('adopt.no-cats-sub') }}</p>
          <Button
            v-if="activeFilterCount > 0"
            :label="$t('adopt.filter-reset')"
            severity="secondary"
            outlined
            rounded
            size="small"
            @click="resetFilters"
          />
        </div>

        <!-- Card grid -->
        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
    </section>

    <!-- CTA BAND -->
    <section
      class="flex w-full flex-col items-center gap-4 bg-[var(--scf-ink)] px-6 py-10 text-center text-white md:flex-row md:justify-between md:px-[60px] md:text-left"
    >
      <p class="flex-1 text-sm font-semibold leading-6 md:text-base">
        {{ $t('adopt.ctaBand.text') }}
      </p>
      <Button
        as="a"
        href="https://www.facebook.com/"
        target="_blank"
        rel="noopener noreferrer"
        :label="$t('adopt.ctaBand.cta')"
        icon="pi pi-facebook"
        severity="contrast"
        rounded
      />
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
