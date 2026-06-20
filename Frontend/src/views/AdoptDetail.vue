<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import type { Cat, StrapiMedia } from '@/models/Cat'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { RouteNames } from '@/router/routeNames'
import { CatSheetService } from '@/services/catSheetService'
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const catSheet = ref<CatSheet | null>(null)
const loading = ref(true)
const notFound = ref(false)
const galleryIndex = ref(0)

const documentId = route.params.documentId as string

onMounted(async () => {
  try {
    const res = await CatSheetService.GetPublicCatSheet(documentId)
    catSheet.value = res.data.data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})

// --- helpers ---
const getImageUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const images = computed<StrapiMedia[]>(() => catSheet.value?.images ?? [])
const cats = computed<Cat[]>(() => catSheet.value?.cats ?? [])
const catNames = computed(() => cats.value.map((c) => c.name).join(' & '))
const heroImage = computed(() => {
  const first = images.value[0]
  return first ? getImageUrl(first.url) : null
})

const statusLabel = (cat: Cat) => {
  if (cat.catStatus === CatStatus.EN_REFUGE) return t('adopt.status-refuge')
  if (cat.catStatus === CatStatus.EN_FAMILLE_ACCUEIL) return t('adopt.status-accueil')
  return null
}

const statusClass = (cat: Cat) => {
  if (cat.catStatus === CatStatus.EN_REFUGE) return 'bg-blue-100 text-blue-700'
  if (cat.catStatus === CatStatus.EN_FAMILLE_ACCUEIL) return 'bg-amber-100 text-amber-700'
  return 'bg-surface-100 text-surface-500'
}

const formatBirthDate = (bd: string | null) => {
  if (!bd) return null
  const d = new Date(bd)
  return d.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const formatAge = (bd: string | null) => {
  if (!bd) return t('adopt.age-unknown')
  const months = Math.floor((Date.now() - new Date(bd).getTime()) / (1000 * 60 * 60 * 24 * 30.44))
  if (months < 12) return t('adopt.age-months', { n: months })
  return t('adopt.age-years', { n: Math.floor(months / 12) })
}

const genderLabel = (cat: Cat) => {
  if (cat.gender === Genders.MALE) return t('adopt.male')
  if (cat.gender === Genders.FEMALE) return t('adopt.female')
  return null
}

const genderIcon = (cat: Cat) => {
  if (cat.gender === Genders.MALE) return 'pi pi-mars'
  if (cat.gender === Genders.FEMALE) return 'pi pi-venus'
  return 'pi pi-question'
}

const healthItems = (cat: Cat) => [
  { label: t('adopt.vaccinated'), value: cat.vaccinated },
  { label: t('adopt.sterilized'), value: cat.sterilized },
  { label: t('adopt.identified'), value: cat.identified },
  { label: t('adopt.decontaminated'), value: cat.decontaminate },
]

const compatItems = (cat: Cat) => [
  { label: t('adopt.cat-friendly'), value: cat.catFriendly },
  { label: t('adopt.dog-friendly'), value: cat.dogFriendly },
  { label: t('adopt.child-friendly'), value: cat.childFriendly },
]

const friendlyDisplay = (value: CatFriendly) => {
  if (value === CatFriendly.YES) return { text: t('adopt.health-yes'), cls: 'bg-green-100 text-green-700' }
  if (value === CatFriendly.NO) return { text: t('adopt.health-no'), cls: 'bg-red-100 text-red-600' }
  return { text: '?', cls: 'bg-surface-100 text-surface-400' }
}
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">

    <!-- LOADING SKELETON -->
    <template v-if="loading">
      <div class="w-full aspect-[21/9] sm:aspect-[21/7] bg-surface-200 dark:bg-surface-700 animate-pulse"></div>
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div class="lg:col-span-2 space-y-4">
            <div class="h-6 bg-surface-200 dark:bg-surface-700 rounded w-3/4 animate-pulse"></div>
            <div class="h-4 bg-surface-100 dark:bg-surface-600 rounded animate-pulse"></div>
            <div class="h-4 bg-surface-100 dark:bg-surface-600 rounded w-5/6 animate-pulse"></div>
            <div class="h-4 bg-surface-100 dark:bg-surface-600 rounded w-2/3 animate-pulse"></div>
          </div>
          <div class="space-y-3">
            <div class="h-48 bg-surface-200 dark:bg-surface-700 rounded-2xl animate-pulse"></div>
          </div>
        </div>
      </div>
    </template>

    <!-- NOT FOUND -->
    <template v-else-if="notFound || !catSheet">
      <div class="flex flex-col items-center justify-center min-h-[60vh] gap-5 text-center px-4">
        <div class="w-20 h-20 rounded-full bg-surface-100 dark:bg-surface-800 flex items-center justify-center">
          <i class="pi pi-exclamation-circle text-3xl text-surface-300"></i>
        </div>
        <h1 class="text-2xl font-bold text-surface-700 dark:text-surface-300">{{ $t('adopt.detail-not-found') }}</h1>
        <p class="text-surface-400">{{ $t('adopt.detail-not-found-sub') }}</p>
        <Button
          :label="$t('adopt.detail-back')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          @click="router.push({ name: RouteNames.ADOPT })"
        />
      </div>
    </template>

    <!-- DETAIL PAGE -->
    <template v-else>

      <!-- HERO -->
      <div class="relative w-full overflow-hidden" style="height: clamp(220px, 40vw, 480px)">
        <img
          v-if="heroImage"
          :src="heroImage"
          :alt="catNames"
          class="absolute inset-0 w-full h-full object-cover"
        />
        <div
          v-else
          class="absolute inset-0 bg-gradient-to-br from-primary-800 to-primary-600"
        ></div>
        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>

        <!-- Hero content -->
        <div class="absolute inset-0 flex flex-col justify-end px-6 pb-8 max-w-6xl mx-auto w-full left-1/2 -translate-x-1/2">
          <!-- Breadcrumb -->
          <nav class="flex items-center gap-1.5 text-white/60 text-xs mb-3 flex-wrap">
            <router-link :to="{ name: RouteNames.HOME }" class="hover:text-white transition-colors">Accueil</router-link>
            <i class="pi pi-angle-right text-xs"></i>
            <router-link :to="{ name: RouteNames.ADOPT }" class="hover:text-white transition-colors">{{ $t('adopt.nav-link') }}</router-link>
            <i class="pi pi-angle-right text-xs"></i>
            <span class="text-white/90">{{ catNames }}</span>
          </nav>

          <!-- Badges -->
          <div class="flex flex-wrap gap-2 mb-3">
            <span
              v-if="cats[0] && statusLabel(cats[0])"
              :class="['text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm', statusClass(cats[0])]"
            >{{ statusLabel(cats[0]) }}</span>
            <span
              v-if="catSheet.isDuo"
              class="text-xs font-semibold px-3 py-1 rounded-full bg-purple-100 text-purple-700"
            >{{ $t('adopt.duo') }}</span>
          </div>

          <!-- Name -->
          <h1 class="text-3xl sm:text-4xl lg:text-5xl font-bold text-white drop-shadow-lg leading-tight">
            {{ catNames }}
          </h1>
        </div>
      </div>

      <!-- BODY -->
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <!-- LEFT: main content -->
          <div class="lg:col-span-2 space-y-8">

            <!-- Description -->
            <section
              v-if="catSheet.description"
              class="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-100 dark:border-surface-700"
            >
              <p class="text-surface-600 dark:text-surface-300 leading-relaxed whitespace-pre-line">
                {{ catSheet.description }}
              </p>
            </section>

            <!-- Cat sections (one per cat; for duo: both shown) -->
            <template v-for="(cat, idx) in cats" :key="cat.documentId">
              <Divider v-if="idx > 0" />
              <section class="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-100 dark:border-surface-700 space-y-5">

                <!-- Cat name header (only for duo) -->
                <div v-if="catSheet.isDuo" class="flex items-center gap-2 pb-1 border-b border-surface-100 dark:border-surface-700">
                  <i class="pi pi-heart text-primary-400 text-sm"></i>
                  <h2 class="text-lg font-bold text-surface-800 dark:text-surface-100">{{ cat.name }}</h2>
                  <div class="flex items-center gap-1.5 ml-2 text-surface-400 text-sm">
                    <i :class="genderIcon(cat)" class="text-xs"></i>
                    <span v-if="genderLabel(cat)">{{ genderLabel(cat) }}</span>
                    <span class="text-surface-300">·</span>
                    <span>{{ formatAge(cat.birthDate) }}</span>
                  </div>
                </div>

                <!-- Health -->
                <div>
                  <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    {{ $t('adopt.detail-health') }}
                  </p>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div
                      v-for="item in healthItems(cat)"
                      :key="item.label"
                      :class="[
                        'flex flex-col items-center gap-1 p-3 rounded-xl text-center',
                        item.value
                          ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                          : 'bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600'
                      ]"
                    >
                      <i
                        :class="[
                          'text-lg',
                          item.value ? 'pi pi-check-circle text-green-500' : 'pi pi-times-circle text-surface-300 dark:text-surface-500'
                        ]"
                      ></i>
                      <span :class="['text-xs font-medium', item.value ? 'text-green-700 dark:text-green-400' : 'text-surface-400']">
                        {{ item.label }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Compatibility -->
                <div>
                  <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    {{ $t('adopt.detail-compatibility') }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <div
                      v-for="item in compatItems(cat)"
                      :key="item.label"
                      class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface-50 dark:bg-surface-700 border border-surface-200 dark:border-surface-600"
                    >
                      <span class="text-sm text-surface-600 dark:text-surface-300">{{ item.label }}</span>
                      <span :class="['text-xs font-semibold px-1.5 py-0.5 rounded-full', friendlyDisplay(item.value).cls]">
                        {{ friendlyDisplay(item.value).text }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- Personality / Moods -->
                <div v-if="(cat.cat_moods ?? []).length > 0">
                  <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
                    {{ $t('adopt.detail-personality') }}
                  </p>
                  <div class="flex flex-wrap gap-2">
                    <span
                      v-for="mood in cat.cat_moods"
                      :key="mood.id"
                      class="px-3 py-1 rounded-full text-sm font-medium bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300 border border-primary-200 dark:border-primary-700"
                    >{{ mood.name }}</span>
                  </div>
                </div>
              </section>
            </template>

            <!-- Photo gallery -->
            <section
              v-if="images.length > 0"
              class="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-100 dark:border-surface-700"
            >
              <p class="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
                {{ $t('adopt.detail-gallery') }}
                <span class="ml-2 font-normal normal-case text-surface-300">({{ images.length }})</span>
              </p>
              <div class="gallery-wrapper rounded-xl overflow-hidden">
                <Galleria
                  v-model:activeIndex="galleryIndex"
                  :value="images"
                  :numVisible="Math.min(images.length, 5)"
                  :circular="true"
                  :showItemNavigators="images.length > 1"
                  :showThumbnails="images.length > 1"
                  class="w-full"
                >
                  <template #item="{ item }">
                    <div class="flex items-center justify-center bg-surface-900 dark:bg-surface-950 rounded-t-xl" style="min-height: 18rem; max-height: 32rem">
                      <img
                        :src="getImageUrl(item.url)"
                        :alt="item.name"
                        class="max-h-[32rem] max-w-full object-contain select-none"
                      />
                    </div>
                  </template>
                  <template #thumbnail="{ item }">
                    <img
                      :src="getImageUrl(item.url)"
                      :alt="item.name"
                      class="w-16 h-12 object-cover rounded"
                    />
                  </template>
                </Galleria>
              </div>
            </section>

          </div>

          <!-- RIGHT: sticky sidebar -->
          <aside class="lg:sticky lg:top-6 space-y-4">

            <!-- Info card -->
            <div class="bg-white dark:bg-surface-800 rounded-2xl p-6 border border-surface-100 dark:border-surface-700 space-y-4">
              <div>
                <h2 class="text-xl font-bold text-surface-800 dark:text-surface-100">{{ catNames }}</h2>
                <div v-if="cats[0]" class="flex items-center gap-1.5 mt-1 text-surface-500 text-sm">
                  <i :class="genderIcon(cats[0])" class="text-xs"></i>
                  <span v-if="genderLabel(cats[0])">{{ genderLabel(cats[0]) }}</span>
                  <span class="text-surface-300">·</span>
                  <span>{{ formatAge(cats[0]?.birthDate ?? null) }}</span>
                </div>
              </div>

              <!-- Status badge -->
              <div v-if="cats[0] && statusLabel(cats[0])">
                <span :class="['text-sm font-semibold px-3 py-1.5 rounded-full', statusClass(cats[0])]">
                  {{ statusLabel(cats[0]) }}
                </span>
              </div>

              <!-- Birth date -->
              <div v-if="cats[0]?.birthDate" class="flex items-center gap-2 text-sm text-surface-500">
                <i class="pi pi-calendar text-xs"></i>
                <span>{{ $t('adopt.detail-birth-date') }} {{ formatBirthDate(cats[0].birthDate) }}</span>
              </div>

              <Divider class="my-2" />

              <!-- CTA adopt -->
              <Button
                :label="$t('adopt.detail-adopt-cta')"
                icon="pi pi-heart"
                class="w-full"
                severity="danger"
              />

              <!-- Back -->
              <Button
                :label="$t('adopt.detail-back')"
                icon="pi pi-arrow-left"
                class="w-full"
                severity="secondary"
                outlined
                @click="router.push({ name: RouteNames.ADOPT })"
              />
            </div>

            <!-- Duo secondary cat quick info -->
            <div
              v-if="catSheet.isDuo && cats[1]"
              class="bg-white dark:bg-surface-800 rounded-2xl p-5 border border-surface-100 dark:border-surface-700"
            >
              <div class="flex items-center gap-2 mb-3">
                <i class="pi pi-heart text-purple-400 text-sm"></i>
                <span class="text-sm font-semibold text-surface-600 dark:text-surface-300">{{ cats[1].name }}</span>
              </div>
              <div class="flex items-center gap-1.5 text-surface-500 text-sm">
                <i :class="genderIcon(cats[1])" class="text-xs"></i>
                <span v-if="genderLabel(cats[1])">{{ genderLabel(cats[1]) }}</span>
                <span class="text-surface-300">·</span>
                <span>{{ formatAge(cats[1].birthDate) }}</span>
              </div>
              <div v-if="cats[1].birthDate" class="flex items-center gap-2 text-xs text-surface-400 mt-1.5">
                <i class="pi pi-calendar text-xs"></i>
                <span>{{ formatBirthDate(cats[1].birthDate) }}</span>
              </div>
            </div>

          </aside>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.gallery-wrapper :deep(.p-galleria-nav-button) {
  color: white;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
}
.gallery-wrapper :deep(.p-galleria-nav-button:hover) {
  background: rgba(0, 0, 0, 0.7);
}
</style>
