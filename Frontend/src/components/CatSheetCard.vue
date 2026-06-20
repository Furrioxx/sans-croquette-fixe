<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { RouteNames } from '@/router/routeNames'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

const props = defineProps<{ catSheet: CatSheet }>()

const getImageUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const images = computed(() => props.catSheet.images ?? [])
const cats = computed(() => props.catSheet.cats ?? [])

const coverImage = computed(() => {
  const first = images.value[0]
  return first ? getImageUrl(first.url) : null
})

const catNames = computed(() =>
  cats.value.map((c) => c.name).join(' & '),
)

const primaryCat = computed(() => cats.value[0])

const statusLabel = computed(() => {
  const s = primaryCat.value?.catStatus
  if (s === CatStatus.EN_REFUGE) return t('adopt.status-refuge')
  if (s === CatStatus.EN_FAMILLE_ACCUEIL) return t('adopt.status-accueil')
  return null
})

const statusClass = computed(() => {
  const s = primaryCat.value?.catStatus
  if (s === CatStatus.EN_REFUGE) return 'bg-blue-100 text-blue-700'
  if (s === CatStatus.EN_FAMILLE_ACCUEIL) return 'bg-amber-100 text-amber-700'
  return ''
})

const genderLabel = computed(() => {
  const g = primaryCat.value?.gender
  if (g === Genders.MALE) return t('adopt.male')
  if (g === Genders.FEMALE) return t('adopt.female')
  return null
})

const genderIcon = computed(() => {
  const g = primaryCat.value?.gender
  if (g === Genders.MALE) return 'pi pi-mars'
  if (g === Genders.FEMALE) return 'pi pi-venus'
  return 'pi pi-question'
})

const age = computed(() => {
  const bd = primaryCat.value?.birthDate
  if (!bd) return t('adopt.age-unknown')
  const months = Math.floor((Date.now() - new Date(bd).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 12) return t('adopt.age-months', { n: months })
  return t('adopt.age-years', { n: Math.floor(months / 12) })
})

const description = computed(() => {
  const d = props.catSheet.description
  if (!d) return null
  return d.length > 130 ? d.slice(0, 127) + '…' : d
})

const healthChips = computed(() => {
  const cat = primaryCat.value
  if (!cat) return []
  return [
    { key: 'vaccinated', label: t('adopt.vaccinated'), show: cat.vaccinated },
    { key: 'sterilized', label: t('adopt.sterilized'), show: cat.sterilized },
    { key: 'identified', label: t('adopt.identified'), show: cat.identified },
    { key: 'decontaminated', label: t('adopt.decontaminated'), show: cat.decontaminate },
  ].filter((c) => c.show)
})

const compatRow = computed(() => {
  const cat = primaryCat.value
  if (!cat) return []
  return [
    { icon: 'pi pi-heart', label: t('adopt.cat-friendly'), value: cat.catFriendly },
    { icon: 'pi pi-cloud', label: t('adopt.dog-friendly'), value: cat.dogFriendly },
    { icon: 'pi pi-star', label: t('adopt.child-friendly'), value: cat.childFriendly },
  ]
})

const friendlyLabel = (value: CatFriendly) => {
  if (value === CatFriendly.YES) return { text: t('adopt.friendly-yes'), cls: 'text-green-600' }
  if (value === CatFriendly.NO) return { text: t('adopt.friendly-no'), cls: 'text-red-500' }
  return { text: t('adopt.friendly-unknown'), cls: 'text-surface-400' }
}
</script>

<template>
  <article class="group bg-white dark:bg-surface-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-surface-100 dark:border-surface-700">

    <!-- Image -->
    <div class="relative aspect-[4/3] overflow-hidden bg-surface-100 dark:bg-surface-700">
      <img
        v-if="coverImage"
        :src="coverImage"
        :alt="catNames"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
      <div
        v-else
        class="w-full h-full flex flex-col items-center justify-center gap-2 text-surface-300 dark:text-surface-500"
      >
        <i class="pi pi-camera text-5xl"></i>
        <span class="text-sm">Pas de photo</span>
      </div>

      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span
          v-if="statusLabel"
          :class="['text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm', statusClass]"
        >{{ statusLabel }}</span>
        <span
          v-if="catSheet.isDuo"
          class="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700"
        >{{ $t('adopt.duo') }}</span>
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-5 gap-4">

      <!-- Name + gender/age -->
      <div>
        <h3 class="text-xl font-bold text-surface-800 dark:text-surface-100 leading-tight">{{ catNames }}</h3>
        <div class="flex items-center gap-1.5 mt-1 text-surface-500 dark:text-surface-400 text-sm">
          <i :class="genderIcon" class="text-xs"></i>
          <span v-if="genderLabel">{{ genderLabel }}</span>
          <span class="text-surface-300 dark:text-surface-600">·</span>
          <span>{{ age }}</span>
        </div>
      </div>

      <!-- Description -->
      <p v-if="description" class="text-sm text-surface-500 dark:text-surface-400 leading-relaxed">
        {{ description }}
      </p>

      <!-- Health chips -->
      <div v-if="healthChips.length" class="flex flex-wrap gap-1.5">
        <span
          v-for="chip in healthChips"
          :key="chip.key"
          class="text-xs font-medium px-2 py-0.5 rounded-full bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800"
        >{{ chip.label }}</span>
      </div>

      <!-- Compatibility -->
      <div class="grid grid-cols-3 gap-2 pt-1 border-t border-surface-100 dark:border-surface-700">
        <div
          v-for="compat in compatRow"
          :key="compat.label"
          class="flex flex-col items-center gap-0.5"
        >
          <span class="text-xs text-surface-400 dark:text-surface-500">{{ compat.label }}</span>
          <span :class="['text-xs font-semibold', friendlyLabel(compat.value).cls]">
            {{ friendlyLabel(compat.value).text }}
          </span>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-auto pt-2">
        <Button
          as="router-link"
          :to="{ name: RouteNames.ADOPT_DETAIL, params: { documentId: catSheet.documentId } }"
          :label="$t('adopt.see-sheet')"
          icon="pi pi-arrow-right"
          iconPos="right"
          class="w-full"
          severity="secondary"
          outlined
        />
      </div>
    </div>
  </article>
</template>
