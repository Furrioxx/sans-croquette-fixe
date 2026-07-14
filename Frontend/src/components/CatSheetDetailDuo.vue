<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import type { Cat } from '@/models/Cat'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { RouteNames } from '@/router/routeNames'
import { formatAge as formatAgeUtil, getCatStatusLabel, isKitten } from '@/utils/catUtils'
import { getCatImageUrl } from '@/utils/catImageUrl'
import { useRelatedCatSheets } from '@/composables/useRelatedCatSheets'
import CatSheetCard from '@/components/CatSheetCard.vue'
import { AdoptionRequestService } from '@/services/adoptionRequestService'
import { useAuthStore } from '@/stores/authentication'
import { computed, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Roles } from '@/router/Roles'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const props = defineProps<{ catSheet: CatSheet }>()
const emit = defineEmits<{ askQuestion: [] }>()

const cats = computed<Cat[]>(() => props.catSheet.cats ?? [])

const hasExistingRequest = ref(false)
const canAskQuestion = computed(
  () => !authStore.isConnected || authStore.getUserRole === Roles.USER,
)

watch(
  () => props.catSheet.documentId,
  async (documentId) => {
    hasExistingRequest.value = false
    if (!authStore.isConnected || !documentId) return
    try {
      const response = await AdoptionRequestService.getAdoptionRequestsForCatSheet(documentId)
      hasExistingRequest.value = response.data.data.length > 0
    } catch {
      hasExistingRequest.value = false
    }
  },
  { immediate: true },
)
const catNames = computed(() => cats.value.map((c) => c.name).join(' & '))

const getImageUrl = getCatImageUrl

const images = computed(() => props.catSheet.images ?? [])
const activeImageIndex = ref(0)
const mainImage = computed(() => {
  const img = images.value[activeImageIndex.value]
  return img ? getImageUrl(img.url) : null
})

const statusLabel = (cat: Cat) => getCatStatusLabel(cat.catStatus, t)

const genderLabel = (cat: Cat) =>
  cat.gender === Genders.MALE ? t('adopt.male') : t('adopt.female')
const kittenLabel = (cat: Cat) => (isKitten(cat) ? t('adopt.kitten') : t('adopt.not-kitten'))
const catTypeLabel = (cat: Cat) => `${kittenLabel(cat)} ${genderLabel(cat).toLowerCase()}`

const formatAge = (bd: string | null) => formatAgeUtil(bd, t)

const formatBirthDate = (bd: string | null) => {
  if (!bd) return null
  return new Date(bd).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const healthSummary = (cat: Cat) => {
  const parts = [
    cat.vaccinated ? t('adopt.vaccinated') : null,
    cat.sterilized ? t('adopt.sterilized') : null,
    cat.decontaminate ? t('adopt.decontaminated') : null,
    cat.identified ? t('adopt.identified') : null,
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : null
}

const compatSummary = computed(() => {
  const [a, b] = cats.value
  if (!a || !b) return null
  const parts: string[] = []
  const dims: {
    key: keyof Pick<Cat, 'catFriendly' | 'dogFriendly' | 'childFriendly'>
    yes: string
    no: string
  }[] = [
    {
      key: 'catFriendly',
      yes: t('adoptDetail.getsAlongCats'),
      no: t('adoptDetail.doesNotKnowCats'),
    },
    {
      key: 'dogFriendly',
      yes: t('adoptDetail.getsAlongDogs'),
      no: t('adoptDetail.doesNotKnowDogs'),
    },
    {
      key: 'childFriendly',
      yes: t('adoptDetail.getsAlongChildren'),
      no: t('adoptDetail.doesNotKnowChildren'),
    },
  ]
  dims.forEach((d) => {
    if (a[d.key] === CatFriendly.YES && b[d.key] === CatFriendly.YES) parts.push(d.yes)
    else if (a[d.key] === CatFriendly.NO || b[d.key] === CatFriendly.NO) parts.push(d.no)
  })
  if (parts.length === dims.length && parts.every((p) => dims.some((d) => d.yes === p))) {
    return t('adoptDetail.getAlongWithEveryone')
  }
  return parts.length ? parts.join(', ') : null
})

const moodNames = (cat: Cat) => (cat.cat_moods ?? []).map((m) => m.name)

const { relatedCats } = useRelatedCatSheets(props.catSheet.documentId)
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- BREADCRUMB -->
    <div class="w-full bg-[var(--scf-bg)] px-4 pt-6 sm:px-6 md:px-[60px]">
      <nav
        class="page-shell flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--scf-muted)]"
      >
        <router-link :to="{ name: RouteNames.HOME }" class="hover:text-[var(--scf-ink)]">{{
          $t('footer.links.home')
        }}</router-link>
        <span>/</span>
        <router-link :to="{ name: RouteNames.ADOPT }" class="hover:text-[var(--scf-ink)]">{{
          $t('adopt.nav-link')
        }}</router-link>
        <span>/</span>
        <span class="text-[var(--scf-ink)]">{{ catNames }}</span>
      </nav>
    </div>

    <!-- MAIN -->
    <section class="w-full bg-[var(--scf-bg)] px-4 py-8 sm:px-6 md:px-[60px]">
      <div class="page-shell grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <!-- GALLERY -->
        <div>
          <div class="mb-3 aspect-[4/3] overflow-hidden rounded-[26px] bg-white">
            <img
              v-if="mainImage"
              :src="mainImage"
              :alt="catNames"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full flex-col items-center justify-center gap-2 text-[var(--scf-muted)]"
            >
              <i class="pi pi-camera text-5xl"></i>
              <span class="text-sm">{{ $t('no-photo') }}</span>
            </div>
          </div>
          <div v-if="images.length > 1" class="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <button
              v-for="(image, index) in images.slice(0, 3)"
              :key="image.id"
              class="aspect-[4/3] overflow-hidden rounded-2xl bg-white"
              :class="{ 'ring-2 ring-[var(--scf-accent)]': index === activeImageIndex }"
              @click="activeImageIndex = index"
            >
              <img
                :src="getImageUrl(image.url)"
                :alt="`${catNames} ${index + 1}`"
                class="h-full w-full object-cover"
              />
            </button>
          </div>

          <div v-if="catSheet.description" class="mt-9 space-y-3">
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
              {{ $t('adoptDetail.whyTogether') }}
            </h2>
            <p class="max-w-xl text-sm leading-8 text-[var(--scf-text)]">
              {{ catSheet.description }}
            </p>
          </div>

          <div
            v-for="cat in cats.filter((c) => c.medicalHistory)"
            :key="cat.documentId"
            class="mt-9 space-y-3"
          >
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
              {{ $t('adoptDetail.medicalHistoryLabel') }} — {{ cat.name }}
            </h2>
            <p class="max-w-xl text-sm leading-8 text-[var(--scf-text)]">
              {{ cat.medicalHistory }}
            </p>
          </div>
        </div>

        <!-- INFO PANEL -->
        <div class="rounded-[26px] bg-white p-5 sm:p-7 lg:sticky lg:top-24 lg:p-9">
          <span
            class="mb-3 inline-block rounded-full bg-[var(--scf-accent-soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--scf-accent-dark)]"
          >
            {{ $t('adoptDetail.groupAdoptionOnly') }}
          </span>
          <h1 class="display-font mb-6 text-3xl font-extrabold text-[var(--scf-ink)] sm:text-4xl">
            {{ catNames }}
          </h1>

          <div
            v-for="cat in cats"
            :key="cat.documentId"
            class="mb-4 flex flex-col gap-2.5 border-b border-[var(--scf-line)] pb-4"
          >
            <div class="flex items-center justify-between gap-3">
              <div class="flex items-center gap-2">
                <span class="display-font text-base font-bold text-[var(--scf-ink)]">{{
                  cat.name
                }}</span>
                <span
                  class="rounded-full bg-[var(--scf-accent-soft)] px-2.5 py-1 text-[10px] font-bold uppercase text-[var(--scf-accent-dark)]"
                >
                  {{ catTypeLabel(cat) }}
                </span>
              </div>
              <span
                v-if="statusLabel(cat)"
                class="rounded-full bg-[var(--scf-ink)] px-2.5 py-1 text-[10px] font-bold uppercase text-white"
              >
                {{ statusLabel(cat) }}
              </span>
            </div>
            <div
              class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-semibold text-[var(--scf-muted)]"
            >
              <span class="inline-flex items-center gap-1.5">
                <i class="pi pi-calendar text-[var(--scf-accent-dark)]"></i>
                {{ formatAge(cat.birthDate) }}
                <template v-if="formatBirthDate(cat.birthDate)">
                  — {{ formatBirthDate(cat.birthDate) }}</template
                >
              </span>
              <span v-if="healthSummary(cat)" class="inline-flex items-center gap-1.5">
                <i class="pi pi-shield text-[var(--scf-accent-dark)]"></i>
                {{ healthSummary(cat) }}
              </span>
              <span v-if="cat.trappingDate" class="inline-flex items-center gap-1.5">
                <i class="pi pi-map-marker text-[var(--scf-accent-dark)]"></i>
                {{ $t('adoptDetail.trappingDateLabel') }} {{ formatBirthDate(cat.trappingDate) }}
              </span>
            </div>
            <div v-if="moodNames(cat).length" class="flex flex-wrap gap-1.5">
              <span
                v-for="mood in moodNames(cat)"
                :key="mood"
                class="rounded-full bg-[var(--scf-bg)] px-2.5 py-1 text-[11px] font-semibold text-[var(--scf-ink)]"
              >
                {{ mood }}
              </span>
            </div>
          </div>

          <div v-if="compatSummary" class="detail-info-row mb-7">
            <span class="text-sm font-semibold text-[var(--scf-muted)]">{{
              $t('adoptDetail.compatLabel')
            }}</span>
            <span class="text-right text-sm font-bold text-[var(--scf-ink)]">{{
              compatSummary
            }}</span>
          </div>

          <div
            v-if="catSheet.tarification"
            class="mb-5 flex items-center justify-between rounded-2xl bg-[var(--scf-bg)] px-5 py-4"
          >
            <span class="text-sm font-semibold text-[var(--scf-text)]">{{
              $t('adoptDetail.adoptionFeeBoth')
            }}</span>
            <span class="display-font text-2xl font-extrabold text-[var(--scf-accent-dark)]"
              >{{ catSheet.tarification.price }} €</span
            >
          </div>

          <Button
            :label="hasExistingRequest ? $t('adoptDetail.alreadyRequested') : $t('adoptDetail.adoptCta', { name: catNames })"
            rounded
            :disabled="hasExistingRequest"
            class="mb-3 w-full !bg-[var(--scf-accent)] !border-[var(--scf-accent)] hover:!bg-[var(--scf-accent-dark)] hover:!border-[var(--scf-accent-dark)]"
            @click="
              router.push({
                name: RouteNames.ADOPTION_FORM,
                params: { documentId: catSheet.documentId },
              })
            "
          />
          <Button
            v-if="canAskQuestion"
            :label="$t('adoptDetail.askQuestion')"
            rounded
            outlined
            severity="secondary"
            class="w-full !border-[var(--scf-line)] !text-[var(--scf-ink)]"
            @click="emit('askQuestion')"
          />
        </div>
      </div>
    </section>

    <!-- RELATED -->
    <section v-if="relatedCats.length" class="w-full bg-white px-4 py-14 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-6">
        <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)] md:text-3xl">
          {{ $t('adoptDetail.otherCats') }}
        </h2>
        <div class="detail-related-grid">
          <CatSheetCard
            v-for="related in relatedCats"
            :key="related.documentId"
            :catSheet="related"
          />
        </div>
      </div>
    </section>
  </div>
</template>
