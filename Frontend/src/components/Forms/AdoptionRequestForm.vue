<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { AdoptionRequestFormValues, AdoptionProcessingStatus } from '@/models/AdoptionRequest'
import CheckboxWithLabel from './elements/CheckboxWithLabel.vue'
import DatePickerWithLabel from './elements/DatePickerWithLabel.vue'
import InputNumberWithLabel from './elements/InputNumberWithLabel.vue'
import InputTextWithLabel from './elements/InputTextWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'
import TextareaWithLabel from './elements/TextareaWithLabel.vue'

const model = defineModel<AdoptionRequestFormValues>({ required: true })
const { t } = useI18n()

const props = withDefaults(
  defineProps<{
    errors?: Record<string, string>
    showStatus?: boolean
    disabled?: boolean
  }>(),
  {
    errors: () => ({}),
    showStatus: false,
    disabled: false,
  },
)

const yesNoOptions = [
  { label: t('yes'), value: true },
  { label: t('no'), value: false },
]

const yesNoOtherOptions = [
  { label: t('yes'), value: 'oui' },
  { label: t('no'), value: 'non' },
  { label: t('adoptionRequest.options.other'), value: 'autre' },
]

const householdOptions = [
  { label: t('adoptionRequest.options.household.alone'), value: 'seul' },
  { label: t('adoptionRequest.options.household.couple'), value: 'couple' },
  { label: t('adoptionRequest.options.household.roommates'), value: 'colocation' },
  { label: t('adoptionRequest.options.other'), value: 'autre' },
]

const housingTypeOptions = [
  { label: t('adoptionRequest.options.housing.apartment'), value: 'appartement' },
  { label: t('adoptionRequest.options.housing.house'), value: 'maison' },
  { label: t('adoptionRequest.options.other'), value: 'autre' },
]

const livingSpaceOptions = [
  { label: t('adoptionRequest.options.livingSpace.indoor'), value: 'interieur' },
  { label: t('adoptionRequest.options.livingSpace.outdoor'), value: 'exterieur' },
  { label: t('adoptionRequest.options.livingSpace.both'), value: 'les_deux' },
  { label: t('adoptionRequest.options.other'), value: 'autre' },
]

const environmentOptions = [
  { label: t('adoptionRequest.options.environment.city'), value: 'ville' },
  { label: t('adoptionRequest.options.environment.country'), value: 'campagne' },
  { label: t('adoptionRequest.options.environment.subdivision'), value: 'lotissement' },
  { label: t('adoptionRequest.options.other'), value: 'autre' },
]

const sterilizedOptions = [
  { label: t('yes'), value: 'oui' },
  { label: t('no'), value: 'non' },
  { label: t('adoptionRequest.options.partially'), value: 'partiellement' },
  { label: t('adoptionRequest.options.notApplicable'), value: 'non_applicable' },
]

const statusOptions: { label: string; value: AdoptionProcessingStatus }[] = [
  { label: t('adoptionRequest.status.pending'), value: 'pending' },
  { label: t('adoptionRequest.status.in_review'), value: 'in_review' },
  { label: t('adoptionRequest.status.approved'), value: 'approved' },
  { label: t('adoptionRequest.status.rejected'), value: 'rejected' },
]

const isApartment = computed(() => model.value.housingType === 'appartement')
const hasGardenDetails = computed(() => isApartment.value && model.value.hasGarden === 'oui')
const hasBalconyDetails = computed(
  () => isApartment.value && model.value.hasBalconyOrTerrace === 'oui',
)
const fieldState = (field: string) => ({
  valid: props.errors[field] ? false : undefined,
  errorMessage: props.errors[field],
})
</script>

<template>
  <div class="flex flex-col gap-6">
    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.general') }}</h2>
        <div class="space-y-2">
          <CheckboxWithLabel
            name="adoption-agreement-accepted"
            v-model="model.agreementAccepted"
            :binary="true"
            :disabled="props.disabled"
            :label="$t('adoptionRequest.fields.agreementAccepted')"
          />
          <Message v-if="props.errors.agreementAccepted" severity="error" size="small" variant="simple">
            {{ props.errors.agreementAccepted }}
          </Message>
        </div>

        <InputTextWithLabel
          name="adoption-animal-name"
          :label="$t('adoptionRequest.fields.animalName')"
          v-model="model.animalName"
          required
          :disabled="props.disabled"
          v-bind="fieldState('animalName')"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-first-name"
            :label="$t('adoptionRequest.fields.firstName')"
            v-model="model.firstName"
            required
            :disabled="props.disabled"
            v-bind="fieldState('firstName')"
          />
          <InputTextWithLabel
            name="adoption-last-name"
            :label="$t('adoptionRequest.fields.lastName')"
            v-model="model.lastName"
            required
            :disabled="props.disabled"
            v-bind="fieldState('lastName')"
          />
        </div>

        <DatePickerWithLabel
          name="adoption-birth-date"
          :label="$t('adoptionRequest.fields.birthDate')"
          v-model="model.birthDate"
          required
          :disabled="props.disabled"
          v-bind="fieldState('birthDate')"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.contact') }}</h2>
        <TextareaWithLabel
          name="adoption-street-address"
          :label="$t('adoptionRequest.fields.streetAddress')"
          v-model="model.streetAddress"
          required
          :disabled="props.disabled"
          v-bind="fieldState('streetAddress')"
        />
        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-postal-code"
            :label="$t('adoptionRequest.fields.postalCode')"
            v-model="model.postalCode"
            required
            :disabled="props.disabled"
            v-bind="fieldState('postalCode')"
          />
          <InputTextWithLabel
            name="adoption-city"
            :label="$t('adoptionRequest.fields.city')"
            v-model="model.city"
            required
            :disabled="props.disabled"
            v-bind="fieldState('city')"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-phone"
            :label="$t('adoptionRequest.fields.phone')"
            v-model="model.phone"
            required
            :disabled="props.disabled"
            v-bind="fieldState('phone')"
          />
          <InputTextWithLabel
            name="adoption-email"
            :label="$t('adoptionRequest.fields.email')"
            type="email"
            v-model="model.email"
            required
            :disabled="props.disabled"
            v-bind="fieldState('email')"
          />
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.household') }}</h2>
        <SelectWithLabel
          name="adoption-household-composition"
          :label="$t('adoptionRequest.fields.householdComposition')"
          :options="householdOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.householdComposition"
          :disabled="props.disabled"
          v-bind="fieldState('householdComposition')"
        />
        <InputNumberWithLabel
          v-if="model.householdComposition === 'colocation'"
          name="adoption-roommate-count"
          :label="$t('adoptionRequest.fields.roommateCount')"
          v-model="model.roommateCount"
          :disabled="props.disabled"
          :min="1"
          v-bind="fieldState('roommateCount')"
        />
        <InputTextWithLabel
          v-if="model.householdComposition === 'autre'"
          name="adoption-household-composition-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.householdCompositionOther"
          :disabled="props.disabled"
          v-bind="fieldState('householdCompositionOther')"
        />

        <SelectWithLabel
          name="adoption-has-children"
          :label="$t('adoptionRequest.fields.hasChildren')"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.hasChildren"
          :disabled="props.disabled"
          v-bind="fieldState('hasChildren')"
        />
        <div v-if="model.hasChildren === true" class="grid gap-4 md:grid-cols-2">
          <InputNumberWithLabel
            name="adoption-children-count"
            :label="$t('adoptionRequest.fields.childrenCount')"
            v-model="model.childrenCount"
            :disabled="props.disabled"
            :min="1"
            v-bind="fieldState('childrenCount')"
          />
          <InputTextWithLabel
            name="adoption-children-ages"
            :label="$t('adoptionRequest.fields.childrenAges')"
            v-model="model.childrenAges"
            :disabled="props.disabled"
            v-bind="fieldState('childrenAges')"
          />
        </div>

        <SelectWithLabel
          name="adoption-household-agreement"
          :label="$t('adoptionRequest.fields.householdAgreement')"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.householdAgreement"
          :disabled="props.disabled"
          v-bind="fieldState('householdAgreement')"
        />
        <TextareaWithLabel
          v-if="model.householdAgreement === false"
          name="adoption-household-disagreement-reason"
          :label="$t('adoptionRequest.fields.householdDisagreementReason')"
          v-model="model.householdDisagreementReason"
          :disabled="props.disabled"
          v-bind="fieldState('householdDisagreementReason')"
        />

        <SelectWithLabel
          name="adoption-is-employed"
          :label="$t('adoptionRequest.fields.isEmployed')"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.isEmployed"
          :disabled="props.disabled"
          v-bind="fieldState('isEmployed')"
        />
        <div v-if="model.isEmployed === true" class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-profession"
            :label="$t('adoptionRequest.fields.profession')"
            v-model="model.profession"
            :disabled="props.disabled"
            v-bind="fieldState('profession')"
          />
          <TextareaWithLabel
            name="adoption-work-schedule"
            :label="$t('adoptionRequest.fields.workSchedule')"
            v-model="model.workSchedule"
            :disabled="props.disabled"
            v-bind="fieldState('workSchedule')"
          />
        </div>

        <InputTextWithLabel
          name="adoption-alone-time"
          :label="$t('adoptionRequest.fields.aloneTimePerDay')"
          v-model="model.aloneTimePerDay"
          required
          :disabled="props.disabled"
          v-bind="fieldState('aloneTimePerDay')"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.housing') }}</h2>
        <SelectWithLabel
          name="adoption-housing-type"
          :label="$t('adoptionRequest.fields.housingType')"
          :options="housingTypeOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.housingType"
          :disabled="props.disabled"
          v-bind="fieldState('housingType')"
        />
        <InputTextWithLabel
          v-if="model.housingType === 'autre'"
          name="adoption-housing-type-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.housingTypeOther"
          :disabled="props.disabled"
          v-bind="fieldState('housingTypeOther')"
        />

        <InputTextWithLabel
          name="adoption-housing-area"
          :label="$t('adoptionRequest.fields.housingArea')"
          v-model="model.housingArea"
          required
          :disabled="props.disabled"
          v-bind="fieldState('housingArea')"
        />

        <SelectWithLabel
          name="adoption-animal-living-space"
          :label="$t('adoptionRequest.fields.animalLivingSpace')"
          :options="livingSpaceOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.animalLivingSpace"
          :disabled="props.disabled"
          v-bind="fieldState('animalLivingSpace')"
        />
        <InputTextWithLabel
          v-if="model.animalLivingSpace === 'autre'"
          name="adoption-animal-living-space-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.animalLivingSpaceOther"
          :disabled="props.disabled"
          v-bind="fieldState('animalLivingSpaceOther')"
        />

        <SelectWithLabel
          name="adoption-environment-type"
          :label="$t('adoptionRequest.fields.environmentType')"
          :options="environmentOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.environmentType"
          :disabled="props.disabled"
          v-bind="fieldState('environmentType')"
        />
        <InputTextWithLabel
          v-if="model.environmentType === 'autre'"
          name="adoption-environment-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.environmentTypeOther"
          :disabled="props.disabled"
          v-bind="fieldState('environmentTypeOther')"
        />

        <SelectWithLabel
          name="adoption-near-busy-road"
          :label="$t('adoptionRequest.fields.nearBusyRoad')"
          :options="yesNoOtherOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.nearBusyRoad"
          :disabled="props.disabled"
          v-bind="fieldState('nearBusyRoad')"
        />
        <InputTextWithLabel
          v-if="model.nearBusyRoad === 'autre'"
          name="adoption-near-busy-road-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.nearBusyRoadOther"
          :disabled="props.disabled"
          v-bind="fieldState('nearBusyRoadOther')"
        />

        <SelectWithLabel
          name="adoption-can-go-outside"
          :label="$t('adoptionRequest.fields.canGoOutside')"
          :options="yesNoOtherOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.canGoOutside"
          :disabled="props.disabled"
          v-bind="fieldState('canGoOutside')"
        />
        <InputTextWithLabel
          v-if="model.canGoOutside === 'autre'"
          name="adoption-can-go-outside-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.canGoOutsideOther"
          :disabled="props.disabled"
          v-bind="fieldState('canGoOutsideOther')"
        />

        <TextareaWithLabel
          name="adoption-living-place-details"
          :label="$t('adoptionRequest.fields.livingPlaceDetails')"
          v-model="model.livingPlaceDetails"
          :disabled="props.disabled"
          v-bind="fieldState('livingPlaceDetails')"
        />
      </div>
    </section>

    <section v-if="isApartment" class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.apartment') }}</h2>
        <InputTextWithLabel
          name="adoption-apartment-floor"
          :label="$t('adoptionRequest.fields.apartmentFloor')"
          v-model="model.apartmentFloor"
          :disabled="props.disabled"
          v-bind="fieldState('apartmentFloor')"
        />

        <SelectWithLabel
          name="adoption-windows-secured"
          :label="$t('adoptionRequest.fields.windowsSecured')"
          :options="yesNoOtherOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.windowsSecured"
          :disabled="props.disabled"
          v-bind="fieldState('windowsSecured')"
        />
        <InputTextWithLabel
          v-if="model.windowsSecured === 'autre'"
          name="adoption-windows-secured-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.windowsSecuredOther"
          :disabled="props.disabled"
          v-bind="fieldState('windowsSecuredOther')"
        />

        <SelectWithLabel
          name="adoption-plans-secure-windows"
          :label="$t('adoptionRequest.fields.plansToSecureWindows')"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.plansToSecureWindows"
          :disabled="props.disabled"
          v-bind="fieldState('plansToSecureWindows')"
        />

        <SelectWithLabel
          name="adoption-has-garden"
          :label="$t('adoptionRequest.fields.hasGarden')"
          :options="yesNoOtherOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.hasGarden"
          :disabled="props.disabled"
          v-bind="fieldState('hasGarden')"
        />
        <InputTextWithLabel
          v-if="model.hasGarden === 'autre'"
          name="adoption-has-garden-other"
          :label="$t('adoptionRequest.fields.specify')"
          v-model="model.hasGardenOther"
          :disabled="props.disabled"
          v-bind="fieldState('hasGardenOther')"
        />
        <div v-if="hasGardenDetails" class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-garden-area"
            :label="$t('adoptionRequest.fields.gardenArea')"
            v-model="model.gardenArea"
            :disabled="props.disabled"
            v-bind="fieldState('gardenArea')"
          />
          <InputTextWithLabel
            name="adoption-garden-fenced"
            :label="$t('adoptionRequest.fields.gardenFencedDetails')"
            v-model="model.gardenFencedDetails"
            :disabled="props.disabled"
            v-bind="fieldState('gardenFencedDetails')"
          />
        </div>

        <SelectWithLabel
          name="adoption-has-balcony"
          :label="$t('adoptionRequest.fields.hasBalconyOrTerrace')"
          :options="yesNoOtherOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.hasBalconyOrTerrace"
          :disabled="props.disabled"
          v-bind="fieldState('hasBalconyOrTerrace')"
        />
        <div v-if="hasBalconyDetails" class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-balcony-area"
            :label="$t('adoptionRequest.fields.balconyOrTerraceArea')"
            v-model="model.balconyOrTerraceArea"
            :disabled="props.disabled"
            v-bind="fieldState('balconyOrTerraceArea')"
          />
          <TextareaWithLabel
            name="adoption-balcony-security"
            :label="$t('adoptionRequest.fields.balconySecurityDetails')"
            v-model="model.balconySecurityDetails"
            :disabled="props.disabled"
            v-bind="fieldState('balconySecurityDetails')"
          />
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.otherAnimals') }}</h2>
        <SelectWithLabel
          name="adoption-has-other-animals"
          :label="$t('adoptionRequest.fields.hasOtherAnimals')"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.hasOtherAnimals"
          :disabled="props.disabled"
          v-bind="fieldState('hasOtherAnimals')"
        />
        <template v-if="model.hasOtherAnimals === true">
          <TextareaWithLabel
            name="adoption-other-animals-details"
            :label="$t('adoptionRequest.fields.otherAnimalsDetails')"
            v-model="model.otherAnimalsDetails"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsDetails')"
          />
          <SelectWithLabel
            name="adoption-other-animals-sterilized"
            :label="$t('adoptionRequest.fields.otherAnimalsSterilized')"
            :options="sterilizedOptions"
            optionLabel="label"
            optionValue="value"
            v-model="model.otherAnimalsSterilized"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsSterilized')"
          />
          <InputTextWithLabel
            name="adoption-other-animals-duration"
            :label="$t('adoptionRequest.fields.otherAnimalsOwnedDuration')"
            v-model="model.otherAnimalsOwnedDuration"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsOwnedDuration')"
          />
        </template>
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">{{ $t('adoptionRequest.sections.additional') }}</h2>
        <TextareaWithLabel
          name="adoption-additional-notes"
          :label="$t('adoptionRequest.fields.additionalNotes')"
          v-model="model.additionalNotes"
          :disabled="props.disabled"
          :rows="5"
          v-bind="fieldState('additionalNotes')"
        />

        <div v-if="props.showStatus">
          <SelectWithLabel
            name="adoption-processing-status"
            :label="$t('adoptionRequest.fields.processingStatus')"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            v-model="model.processingStatus"
            :disabled="props.disabled"
            v-bind="fieldState('processingStatus')"
          />
        </div>

        <div class="rounded-xl bg-surface-50 p-4 text-sm leading-relaxed text-surface-600">
          {{ $t('adoptionRequest.commitmentText') }}
        </div>

        <div class="space-y-2">
          <CheckboxWithLabel
            name="adoption-responsibility-accepted"
            v-model="model.responsibilityCommitmentAccepted"
            :binary="true"
            :label="$t('adoptionRequest.fields.responsibilityCommitmentAccepted')"
            :disabled="props.disabled"
          />
          <Message
            v-if="props.errors.responsibilityCommitmentAccepted"
            severity="error"
            size="small"
            variant="simple"
          >
            {{ props.errors.responsibilityCommitmentAccepted }}
          </Message>
        </div>
      </div>
    </section>
  </div>
</template>
