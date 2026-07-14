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

const cat = computed<Cat>(() => props.catSheet.cats[0]!)

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

const getImageUrl = getCatImageUrl

const images = computed(() => props.catSheet.images ?? [])
const activeImageIndex = ref(0)
const mainImage = computed(() => {
  const img = images.value[activeImageIndex.value]
  return img ? getImageUrl(img.url) : null
})

const statusLabel = computed(() => getCatStatusLabel(cat.value.catStatus, t))

const genderLabel = computed(() =>
  cat.value.gender === Genders.MALE ? t('adopt.male') : t('adopt.female'),
)
const kittenLabel = computed(() =>
  isKitten(cat.value) ? t('adopt.kitten') : t('adopt.not-kitten'),
)

const formatBirthDate = (bd: string | null) => {
  if (!bd) return null
  return new Date(bd).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

const formatAge = (bd: string | null) => formatAgeUtil(bd, t)

const healthSummary = computed(() => {
  const parts = [
    cat.value.vaccinated ? t('adopt.vaccinated') : null,
    cat.value.sterilized ? t('adopt.sterilized') : null,
    cat.value.decontaminate ? t('adopt.decontaminated') : null,
    cat.value.identified ? t('adopt.identified') : null,
  ].filter(Boolean)
  return parts.length ? parts.join(', ') : null
})

const compatSummary = computed(() => {
  const parts: string[] = []
  const compat: { value: CatFriendly; yes: string; no: string }[] = [
    {
      value: cat.value.catFriendly,
      yes: t('adoptDetail.getsAlongCats'),
      no: t('adoptDetail.doesNotKnowCats'),
    },
    {
      value: cat.value.dogFriendly,
      yes: t('adoptDetail.getsAlongDogs'),
      no: t('adoptDetail.doesNotKnowDogs'),
    },
    {
      value: cat.value.childFriendly,
      yes: t('adoptDetail.getsAlongChildren'),
      no: t('adoptDetail.doesNotKnowChildren'),
    },
  ]
  compat.forEach((c) => {
    if (c.value === CatFriendly.YES) parts.push(c.yes)
    if (c.value === CatFriendly.NO) parts.push(c.no)
  })
  return parts.length ? parts.join(', ') : null
})

const moodNames = computed(() => (cat.value.cat_moods ?? []).map((m) => m.name))

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
        <span class="text-[var(--scf-ink)]">{{ cat.name }}</span>
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
              :alt="cat.name"
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
                :alt="`${cat.name} ${index + 1}`"
                class="h-full w-full object-cover"
              />
            </button>
          </div>

          <div v-if="catSheet.description" class="mt-9 space-y-3">
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
              {{ $t('adoptDetail.whyAdopt') }}
            </h2>
            <p class="max-w-xl text-sm leading-8 text-[var(--scf-text)]">
              {{ catSheet.description }}
            </p>
          </div>

          <div v-if="cat.medicalHistory" class="mt-9 space-y-3">
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)]">
              {{ $t('adoptDetail.medicalHistoryLabel') }}
            </h2>
            <p class="max-w-xl text-sm leading-8 text-[var(--scf-text)]">
              {{ cat.medicalHistory }}
            </p>
          </div>
        </div>

        <!-- INFO PANEL -->
        <div class="rounded-[26px] bg-white p-5 sm:p-7 lg:sticky lg:top-24 lg:p-9">
          <div class="mb-4 flex flex-wrap gap-2">
            <span
              class="rounded-full bg-[var(--scf-accent-soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--scf-accent-dark)]"
            >
              {{ kittenLabel }}
            </span>
            <span
              class="rounded-full bg-[var(--scf-accent-soft)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-[var(--scf-accent-dark)]"
            >
              {{ genderLabel }}
            </span>
            <span
              v-if="statusLabel"
              class="rounded-full bg-[var(--scf-ink)] px-3.5 py-1.5 text-xs font-bold uppercase tracking-wide text-white"
            >
              {{ statusLabel }}
            </span>
          </div>

          <h1 class="display-font mb-6 text-3xl font-extrabold text-[var(--scf-ink)] sm:text-4xl">
            {{ cat.name }}
          </h1>

          <div v-if="moodNames.length" class="mb-6 flex flex-wrap gap-2">
            <span
              v-for="mood in moodNames"
              :key="mood"
              class="rounded-full bg-[var(--scf-bg)] px-3 py-1 text-xs font-semibold text-[var(--scf-ink)]"
            >
              {{ mood }}
            </span>
          </div>

          <div class="mb-7 flex flex-col gap-4">
            <div v-if="healthSummary" class="detail-info-row border-b border-[var(--scf-line)] pb-3.5">
              <span class="text-sm font-semibold text-[var(--scf-muted)]">{{
                $t('adoptDetail.healthLabel')
              }}</span>
              <span class="text-right text-sm font-bold text-[var(--scf-ink)]">{{
                healthSummary
              }}</span>
            </div>
            <div v-if="compatSummary" class="detail-info-row border-b border-[var(--scf-line)] pb-3.5">
              <span class="text-sm font-semibold text-[var(--scf-muted)]">{{
                $t('adoptDetail.compatLabel')
              }}</span>
              <span class="text-right text-sm font-bold text-[var(--scf-ink)]">{{
                compatSummary
              }}</span>
            </div>
            <div
              v-if="cat.birthDate"
              class="detail-info-row"
              :class="{ 'border-b border-[var(--scf-line)] pb-3.5': cat.trappingDate }"
            >
              <span class="text-sm font-semibold text-[var(--scf-muted)]">{{
                $t('adoptDetail.birthLabel')
              }}</span>
              <span class="text-right text-sm font-bold text-[var(--scf-ink)]"
                >{{ formatBirthDate(cat.birthDate) }} ({{ formatAge(cat.birthDate) }})</span
              >
            </div>
            <div v-if="cat.trappingDate" class="detail-info-row">
              <span class="text-sm font-semibold text-[var(--scf-muted)]">{{
                $t('adoptDetail.trappingDateLabel')
              }}</span>
              <span class="text-right text-sm font-bold text-[var(--scf-ink)]">{{
                formatBirthDate(cat.trappingDate)
              }}</span>
            </div>
          </div>

          <div
            v-if="catSheet.tarification"
            class="mb-5 flex items-center justify-between rounded-2xl bg-[var(--scf-bg)] px-5 py-4"
          >
            <span class="text-sm font-semibold text-[var(--scf-text)]">{{
              $t('adoptDetail.adoptionFee')
            }}</span>
            <span class="display-font text-2xl font-extrabold text-[var(--scf-accent-dark)]"
              >{{ catSheet.tarification.price }} €</span
            >
          </div>

          <Button
            :label="hasExistingRequest ? $t('adoptDetail.alreadyRequested') : $t('adoptDetail.adoptCta', { name: cat.name })"
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
