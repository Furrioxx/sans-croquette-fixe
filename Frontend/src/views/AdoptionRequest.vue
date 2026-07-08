<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '@/stores/authentication'
import { RouteNames } from '@/router/routeNames'
import { CatSheetService } from '@/services/catSheetService'
import { AdoptionRequestService } from '@/services/adoptionRequestService'
import type { CatSheet } from '@/models/CatSheet'
import AdoptionRequestForm from '@/components/Forms/AdoptionRequestForm.vue'
import {
  createEmptyAdoptionRequestForm,
  type AdoptionRequestFormValues,
} from '@/models/AdoptionRequest'
import notificationService from '@/services/notificationService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const { t } = useI18n()

const documentId = route.params.documentId as string
const loading = ref(true)
const submitting = ref(false)
const catSheet = ref<CatSheet | null>(null)
const form = reactive<AdoptionRequestFormValues>(createEmptyAdoptionRequestForm(documentId))
const errors = ref<Record<string, string>>({})

const catNames = computed(() => catSheet.value?.cats?.map((cat) => cat.name).join(' & ') ?? '')

const resetConditionalFields = () => {
  if (form.householdComposition !== 'colocation') form.roommateCount = null
  if (form.householdComposition !== 'autre') form.householdCompositionOther = null
  if (form.hasChildren !== true) {
    form.childrenCount = null
    form.childrenAges = null
  }
  if (form.householdAgreement !== false) form.householdDisagreementReason = null
  if (form.isEmployed !== true) {
    form.profession = null
    form.workSchedule = null
  }
  if (form.housingType !== 'appartement') {
    form.apartmentFloor = null
    form.windowsSecured = null
    form.windowsSecuredOther = null
    form.plansToSecureWindows = null
    form.hasGarden = null
    form.hasGardenOther = null
    form.gardenArea = null
    form.gardenFencedDetails = null
    form.hasBalconyOrTerrace = null
    form.balconyOrTerraceArea = null
    form.balconySecurityDetails = null
  }
  if (form.housingType !== 'autre') form.housingTypeOther = null
  if (form.animalLivingSpace !== 'autre') form.animalLivingSpaceOther = null
  if (form.environmentType !== 'autre') form.environmentTypeOther = null
  if (form.nearBusyRoad !== 'autre') form.nearBusyRoadOther = null
  if (form.canGoOutside !== 'autre') form.canGoOutsideOther = null
  if (form.windowsSecured !== 'autre') form.windowsSecuredOther = null
  if (form.hasGarden !== 'autre') form.hasGardenOther = null
  if (form.hasGarden !== 'oui') {
    form.gardenArea = null
    form.gardenFencedDetails = null
  }
  if (form.hasBalconyOrTerrace !== 'oui') {
    form.balconyOrTerraceArea = null
    form.balconySecurityDetails = null
  }
  if (form.hasOtherAnimals !== true) {
    form.otherAnimalsDetails = null
    form.otherAnimalsSterilized = null
    form.otherAnimalsOwnedDuration = null
  }
}

const validateForm = () => {
  const nextErrors: Record<string, string> = {}
  const requiredFields: Array<[keyof AdoptionRequestFormValues, boolean]> = [
    ['animalName', !form.animalName.trim()],
    ['firstName', !form.firstName.trim()],
    ['lastName', !form.lastName.trim()],
    ['birthDate', !form.birthDate],
    ['streetAddress', !form.streetAddress.trim()],
    ['postalCode', !form.postalCode.trim()],
    ['city', !form.city.trim()],
    ['phone', !form.phone.trim()],
    ['email', !form.email.trim()],
    ['householdComposition', !form.householdComposition],
    ['hasChildren', form.hasChildren === null],
    ['householdAgreement', form.householdAgreement === null],
    ['isEmployed', form.isEmployed === null],
    ['aloneTimePerDay', !form.aloneTimePerDay.trim()],
    ['housingType', !form.housingType],
    ['housingArea', !form.housingArea.trim()],
    ['animalLivingSpace', !form.animalLivingSpace],
    ['environmentType', !form.environmentType],
    ['nearBusyRoad', !form.nearBusyRoad],
    ['canGoOutside', !form.canGoOutside],
    ['hasOtherAnimals', form.hasOtherAnimals === null],
  ]

  requiredFields.forEach(([field, invalid]) => {
    if (invalid) nextErrors[field] = t('requiredInputError')
  })

  if (!form.agreementAccepted) nextErrors.agreementAccepted = t('requiredInputError')
  if (!form.responsibilityCommitmentAccepted) {
    nextErrors.responsibilityCommitmentAccepted = t('requiredInputError')
  }

  if (form.householdComposition === 'colocation' && !form.roommateCount) {
    nextErrors.roommateCount = t('requiredInputError')
  }
  if (form.householdComposition === 'autre' && !form.householdCompositionOther?.trim()) {
    nextErrors.householdCompositionOther = t('requiredInputError')
  }
  if (form.hasChildren === true && !form.childrenCount) {
    nextErrors.childrenCount = t('requiredInputError')
  }
  if (form.hasChildren === true && !form.childrenAges?.trim()) {
    nextErrors.childrenAges = t('requiredInputError')
  }
  if (form.householdAgreement === false && !form.householdDisagreementReason?.trim()) {
    nextErrors.householdDisagreementReason = t('requiredInputError')
  }
  if (form.isEmployed === true && !form.profession?.trim()) {
    nextErrors.profession = t('requiredInputError')
  }
  if (form.isEmployed === true && !form.workSchedule?.trim()) {
    nextErrors.workSchedule = t('requiredInputError')
  }
  if (form.housingType === 'autre' && !form.housingTypeOther?.trim()) {
    nextErrors.housingTypeOther = t('requiredInputError')
  }
  if (form.animalLivingSpace === 'autre' && !form.animalLivingSpaceOther?.trim()) {
    nextErrors.animalLivingSpaceOther = t('requiredInputError')
  }
  if (form.environmentType === 'autre' && !form.environmentTypeOther?.trim()) {
    nextErrors.environmentTypeOther = t('requiredInputError')
  }
  if (form.nearBusyRoad === 'autre' && !form.nearBusyRoadOther?.trim()) {
    nextErrors.nearBusyRoadOther = t('requiredInputError')
  }
  if (form.canGoOutside === 'autre' && !form.canGoOutsideOther?.trim()) {
    nextErrors.canGoOutsideOther = t('requiredInputError')
  }
  if (form.housingType === 'appartement' && !form.apartmentFloor?.trim()) {
    nextErrors.apartmentFloor = t('requiredInputError')
  }
  if (form.housingType === 'appartement' && !form.windowsSecured) {
    nextErrors.windowsSecured = t('requiredInputError')
  }
  if (form.windowsSecured === 'autre' && !form.windowsSecuredOther?.trim()) {
    nextErrors.windowsSecuredOther = t('requiredInputError')
  }
  if (form.housingType === 'appartement' && form.plansToSecureWindows === null) {
    nextErrors.plansToSecureWindows = t('requiredInputError')
  }
  if (form.housingType === 'appartement' && !form.hasGarden) {
    nextErrors.hasGarden = t('requiredInputError')
  }
  if (form.hasGarden === 'autre' && !form.hasGardenOther?.trim()) {
    nextErrors.hasGardenOther = t('requiredInputError')
  }
  if (form.hasGarden === 'oui' && !form.gardenArea?.trim()) {
    nextErrors.gardenArea = t('requiredInputError')
  }
  if (form.hasGarden === 'oui' && !form.gardenFencedDetails?.trim()) {
    nextErrors.gardenFencedDetails = t('requiredInputError')
  }
  if (form.housingType === 'appartement' && !form.hasBalconyOrTerrace) {
    nextErrors.hasBalconyOrTerrace = t('requiredInputError')
  }
  if (form.hasBalconyOrTerrace === 'oui' && !form.balconyOrTerraceArea?.trim()) {
    nextErrors.balconyOrTerraceArea = t('requiredInputError')
  }
  if (form.hasBalconyOrTerrace === 'oui' && !form.balconySecurityDetails?.trim()) {
    nextErrors.balconySecurityDetails = t('requiredInputError')
  }
  if (form.hasOtherAnimals === true && !form.otherAnimalsDetails?.trim()) {
    nextErrors.otherAnimalsDetails = t('requiredInputError')
  }
  if (form.hasOtherAnimals === true && !form.otherAnimalsSterilized) {
    nextErrors.otherAnimalsSterilized = t('requiredInputError')
  }
  if (form.hasOtherAnimals === true && !form.otherAnimalsOwnedDuration?.trim()) {
    nextErrors.otherAnimalsOwnedDuration = t('requiredInputError')
  }

  errors.value = nextErrors
  return Object.keys(nextErrors).length === 0
}

const submit = async () => {
  resetConditionalFields()

  if (!validateForm()) {
    notificationService.showAlert(t('warning'), t('adoptionRequest.validationError'))
    return
  }

  try {
    submitting.value = true
    await AdoptionRequestService.createAdoptionRequest(form)
    notificationService.showSuccess(t('success'), t('adoptionRequest.createSuccess'))
    router.push({ name: RouteNames.ADOPT_DETAIL, params: { documentId } })
  } catch {
    notificationService.showError(t('error'), t('adoptionRequest.createError'))
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!authStore.isConnected) {
    router.push({
      name: RouteNames.LOGIN,
      query: { redirect: route.fullPath },
    })
    return
  }

  try {
    const response = await CatSheetService.GetPublicCatSheet(documentId)
    catSheet.value = response.data.data
    form.catSheet = response.data.data.documentId
    form.animalName = response.data.data.cats.map((cat: any) => cat.name).join(' & ')
    form.email = authStore.user?.email ?? ''
  } catch {
    router.push({ name: RouteNames.ADOPT })
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 py-10">
    <div class="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
      <div v-if="loading" class="rounded-2xl bg-white p-8 shadow-sm">
        <i class="pi pi-spin pi-spinner mr-2"></i>Chargement du formulaire…
      </div>

      <template v-else>
        <section class="mb-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-surface-100">
          <div class="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm font-medium uppercase tracking-wide text-primary-600">
                {{ $t('adoptionRequest.title') }}
              </p>
              <h1 class="text-2xl font-bold text-surface-900">
                {{ catNames }}
              </h1>
              <p class="mt-2 text-sm text-surface-500">
                {{ $t('adoptionRequest.subtitle') }}
              </p>
            </div>
            <Button
              :label="$t('back')"
              icon="pi pi-arrow-left"
              severity="secondary"
              outlined
              @click="router.push({ name: RouteNames.ADOPT_DETAIL, params: { documentId } })"
            />
          </div>
        </section>

        <AdoptionRequestForm v-model="form" :errors="errors" />

        <div class="mt-6 flex justify-end gap-3">
          <Button
            :label="$t('cancel')"
            severity="secondary"
            outlined
            @click="router.push({ name: RouteNames.ADOPT_DETAIL, params: { documentId } })"
          />
          <Button
            :label="$t('adoptionRequest.submit')"
            icon="pi pi-send"
            :loading="submitting"
            @click="submit"
          />
        </div>
      </template>
    </div>
  </div>
</template>
