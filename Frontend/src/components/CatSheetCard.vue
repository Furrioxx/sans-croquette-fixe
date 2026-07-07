<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import type { Cat } from '@/models/Cat'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import { Genders } from '@/models/Enums/Genders'
import { RouteNames } from '@/router/routeNames'
import CatSheetDetails from '@/components/CatSheetDetails.vue'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { isKitten, kittenLabelClass } from '@/utils/catUtils'

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

const catNames = computed(() => cats.value.map((c) => c.name).join(' & '))

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

const genderLabel = computed(() =>
  cats.value
    .map((c) => (c.gender === Genders.MALE ? t('adopt.male') : t('adopt.female')))
    .join(' & '),
)

const age = computed(() => {
  const bd = primaryCat.value?.birthDate
  if (!bd) return t('adopt.age-unknown')
  const months = Math.floor((Date.now() - new Date(bd).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 12) return t('adopt.age-months', { n: months })
  return t('adopt.age-years', { n: Math.floor(months / 12) })
})

const kittenLabel = (cat: Cat) => (isKitten(cat) ? t('adopt.kitten') : t('adopt.not-kitten'))
</script>

<template>
  <article
    class="group bg-white dark:bg-surface-800 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-surface-100 dark:border-surface-700"
  >
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
        <span class="text-sm">{{ $t('no-photo') }}</span>
      </div>

      <!-- Badges overlay -->
      <div class="absolute top-3 left-3 flex flex-wrap gap-1.5">
        <span
          v-if="statusLabel"
          :class="['text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm', statusClass]"
          >{{ statusLabel }}</span
        >
        <span
          v-if="catSheet.isDuo"
          class="text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-700"
          >{{ $t('adopt.duo') }}</span
        >
      </div>
    </div>

    <!-- Content -->
    <div class="flex flex-col flex-1 p-5 gap-4">
      <!-- Name + gender/age -->
      <div>
        <h3 class="text-xl font-bold text-surface-800 dark:text-surface-100 leading-tight">
          {{ catNames }}
        </h3>
        <div class="flex items-center gap-1.5 mt-1 text-surface-500 dark:text-surface-400 text-sm">
          <span>{{ genderLabel }}</span>
          <span class="text-surface-300 dark:text-surface-600">·</span>
          <span>{{ age }}</span>
        </div>
        <div class="mt-2">
          <span
            v-for="cat in cats"
            :key="cat.documentId"
            :class="[
              'text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-sm mr-1',
              kittenLabelClass(kittenLabel(cat), $t),
            ]"
            >{{ catSheet.isDuo ? `${cat.name} · ` : '' }}{{ kittenLabel(cat) }}</span
          >
        </div>
      </div>

      <CatSheetDetails :catSheet="catSheet" />

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
