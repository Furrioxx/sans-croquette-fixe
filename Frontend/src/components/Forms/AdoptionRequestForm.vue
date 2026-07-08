<script setup lang="ts">
import { computed } from 'vue'
import type { AdoptionRequestFormValues, AdoptionProcessingStatus } from '@/models/AdoptionRequest'
import CheckboxWithLabel from './elements/CheckboxWithLabel.vue'
import DatePickerWithLabel from './elements/DatePickerWithLabel.vue'
import InputNumberWithLabel from './elements/InputNumberWithLabel.vue'
import InputTextWithLabel from './elements/InputTextWithLabel.vue'
import SelectWithLabel from './elements/SelectWithLabel.vue'
import TextareaWithLabel from './elements/TextareaWithLabel.vue'

const model = defineModel<AdoptionRequestFormValues>({ required: true })

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
  { label: 'Oui', value: true },
  { label: 'Non', value: false },
]

const yesNoOtherOptions = [
  { label: 'Oui', value: 'oui' },
  { label: 'Non', value: 'non' },
  { label: 'Autre', value: 'autre' },
]

const householdOptions = [
  { label: 'Seul', value: 'seul' },
  { label: 'En couple', value: 'couple' },
  { label: 'Colocation', value: 'colocation' },
  { label: 'Autre', value: 'autre' },
]

const housingTypeOptions = [
  { label: 'Appartement', value: 'appartement' },
  { label: 'Maison', value: 'maison' },
  { label: 'Autre', value: 'autre' },
]

const livingSpaceOptions = [
  { label: 'Intérieur', value: 'interieur' },
  { label: 'Extérieur', value: 'exterieur' },
  { label: 'Les deux', value: 'les_deux' },
  { label: 'Autre', value: 'autre' },
]

const environmentOptions = [
  { label: 'Ville', value: 'ville' },
  { label: 'Campagne', value: 'campagne' },
  { label: 'Lotissement', value: 'lotissement' },
  { label: 'Autre', value: 'autre' },
]

const sterilizedOptions = [
  { label: 'Oui', value: 'oui' },
  { label: 'Non', value: 'non' },
  { label: 'Partiellement', value: 'partiellement' },
  { label: 'Non applicable', value: 'non_applicable' },
]

const statusOptions: { label: string; value: AdoptionProcessingStatus }[] = [
  { label: 'En attente', value: 'pending' },
  { label: 'En cours', value: 'in_review' },
  { label: 'Acceptée', value: 'approved' },
  { label: 'Refusée', value: 'rejected' },
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
        <h2 class="text-lg font-semibold text-surface-900">Informations générales</h2>
        <div class="space-y-2">
          <CheckboxWithLabel
            name="adoption-agreement-accepted"
            v-model="model.agreementAccepted"
            :binary="true"
            :disabled="props.disabled"
            label="Êtes-vous d’accord avec la demande ci-dessous ?"
          />
          <Message v-if="props.errors.agreementAccepted" severity="error" size="small" variant="simple">
            {{ props.errors.agreementAccepted }}
          </Message>
        </div>

        <InputTextWithLabel
          name="adoption-animal-name"
          label="Nom de l’animal"
          v-model="model.animalName"
          required
          :disabled="props.disabled"
          v-bind="fieldState('animalName')"
        />

        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-first-name"
            label="Prénom"
            v-model="model.firstName"
            required
            :disabled="props.disabled"
            v-bind="fieldState('firstName')"
          />
          <InputTextWithLabel
            name="adoption-last-name"
            label="Nom"
            v-model="model.lastName"
            required
            :disabled="props.disabled"
            v-bind="fieldState('lastName')"
          />
        </div>

        <DatePickerWithLabel
          name="adoption-birth-date"
          label="Date de naissance"
          v-model="model.birthDate"
          required
          :disabled="props.disabled"
          v-bind="fieldState('birthDate')"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">Coordonnées</h2>
        <TextareaWithLabel
          name="adoption-street-address"
          label="Adresse postale complète"
          v-model="model.streetAddress"
          required
          :disabled="props.disabled"
          v-bind="fieldState('streetAddress')"
        />
        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-postal-code"
            label="Code postal"
            v-model="model.postalCode"
            required
            :disabled="props.disabled"
            v-bind="fieldState('postalCode')"
          />
          <InputTextWithLabel
            name="adoption-city"
            label="Ville"
            v-model="model.city"
            required
            :disabled="props.disabled"
            v-bind="fieldState('city')"
          />
        </div>
        <div class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-phone"
            label="Téléphone"
            v-model="model.phone"
            required
            :disabled="props.disabled"
            v-bind="fieldState('phone')"
          />
          <InputTextWithLabel
            name="adoption-email"
            label="Email"
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
        <h2 class="text-lg font-semibold text-surface-900">Foyer et disponibilité</h2>
        <SelectWithLabel
          name="adoption-household-composition"
          label="Composition du foyer"
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
          label="Nombre de colocataires"
          v-model="model.roommateCount"
          :disabled="props.disabled"
          :min="1"
          v-bind="fieldState('roommateCount')"
        />
        <InputTextWithLabel
          v-if="model.householdComposition === 'autre'"
          name="adoption-household-composition-other"
          label="Précisez"
          v-model="model.householdCompositionOther"
          :disabled="props.disabled"
          v-bind="fieldState('householdCompositionOther')"
        />

        <SelectWithLabel
          name="adoption-has-children"
          label="Avez-vous des enfants ?"
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
            label="Combien ?"
            v-model="model.childrenCount"
            :disabled="props.disabled"
            :min="1"
            v-bind="fieldState('childrenCount')"
          />
          <InputTextWithLabel
            name="adoption-children-ages"
            label="Âges"
            v-model="model.childrenAges"
            :disabled="props.disabled"
            v-bind="fieldState('childrenAges')"
          />
        </div>

        <SelectWithLabel
          name="adoption-household-agreement"
          label="Tout le foyer est-il d’accord ?"
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
          label="Qui n’est pas d’accord et pourquoi ?"
          v-model="model.householdDisagreementReason"
          :disabled="props.disabled"
          v-bind="fieldState('householdDisagreementReason')"
        />

        <SelectWithLabel
          name="adoption-is-employed"
          label="Travaillez-vous ?"
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
            label="Profession"
            v-model="model.profession"
            :disabled="props.disabled"
            v-bind="fieldState('profession')"
          />
          <TextareaWithLabel
            name="adoption-work-schedule"
            label="Horaires"
            v-model="model.workSchedule"
            :disabled="props.disabled"
            v-bind="fieldState('workSchedule')"
          />
        </div>

        <InputTextWithLabel
          name="adoption-alone-time"
          label="Temps seul dans la journée"
          v-model="model.aloneTimePerDay"
          required
          :disabled="props.disabled"
          v-bind="fieldState('aloneTimePerDay')"
        />
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">Logement</h2>
        <SelectWithLabel
          name="adoption-housing-type"
          label="Vous vivez ?"
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
          label="Précisez"
          v-model="model.housingTypeOther"
          :disabled="props.disabled"
          v-bind="fieldState('housingTypeOther')"
        />

        <InputTextWithLabel
          name="adoption-housing-area"
          label="Superficie du logement"
          v-model="model.housingArea"
          required
          :disabled="props.disabled"
          v-bind="fieldState('housingArea')"
        />

        <SelectWithLabel
          name="adoption-animal-living-space"
          label="L’animal vivra"
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
          label="Précisez"
          v-model="model.animalLivingSpaceOther"
          :disabled="props.disabled"
          v-bind="fieldState('animalLivingSpaceOther')"
        />

        <SelectWithLabel
          name="adoption-environment-type"
          label="Habitez-vous"
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
          label="Précisez"
          v-model="model.environmentTypeOther"
          :disabled="props.disabled"
          v-bind="fieldState('environmentTypeOther')"
        />

        <SelectWithLabel
          name="adoption-near-busy-road"
          label="À proximité d’une route passante ?"
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
          label="Précisez"
          v-model="model.nearBusyRoadOther"
          :disabled="props.disabled"
          v-bind="fieldState('nearBusyRoadOther')"
        />

        <SelectWithLabel
          name="adoption-can-go-outside"
          label="L’animal pourra-t-il sortir ?"
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
          label="Précisez"
          v-model="model.canGoOutsideOther"
          :disabled="props.disabled"
          v-bind="fieldState('canGoOutsideOther')"
        />

        <TextareaWithLabel
          name="adoption-living-place-details"
          label="Précisez votre lieu de vie"
          v-model="model.livingPlaceDetails"
          :disabled="props.disabled"
          v-bind="fieldState('livingPlaceDetails')"
        />
      </div>
    </section>

    <section v-if="isApartment" class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">Informations appartement</h2>
        <InputTextWithLabel
          name="adoption-apartment-floor"
          label="À quel étage ?"
          v-model="model.apartmentFloor"
          :disabled="props.disabled"
          v-bind="fieldState('apartmentFloor')"
        />

        <SelectWithLabel
          name="adoption-windows-secured"
          label="Fenêtres sécurisées ?"
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
          label="Précisez"
          v-model="model.windowsSecuredOther"
          :disabled="props.disabled"
          v-bind="fieldState('windowsSecuredOther')"
        />

        <SelectWithLabel
          name="adoption-plans-secure-windows"
          label="Envisagez-vous de sécuriser vos fenêtres ?"
          :options="yesNoOptions"
          optionLabel="label"
          optionValue="value"
          v-model="model.plansToSecureWindows"
          :disabled="props.disabled"
          v-bind="fieldState('plansToSecureWindows')"
        />

        <SelectWithLabel
          name="adoption-has-garden"
          label="Avez-vous un jardin ?"
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
          label="Précisez"
          v-model="model.hasGardenOther"
          :disabled="props.disabled"
          v-bind="fieldState('hasGardenOther')"
        />
        <div v-if="hasGardenDetails" class="grid gap-4 md:grid-cols-2">
          <InputTextWithLabel
            name="adoption-garden-area"
            label="Superficie du jardin"
            v-model="model.gardenArea"
            :disabled="props.disabled"
            v-bind="fieldState('gardenArea')"
          />
          <InputTextWithLabel
            name="adoption-garden-fenced"
            label="Grillage / hauteur"
            v-model="model.gardenFencedDetails"
            :disabled="props.disabled"
            v-bind="fieldState('gardenFencedDetails')"
          />
        </div>

        <SelectWithLabel
          name="adoption-has-balcony"
          label="Balcon ou terrasse ?"
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
            label="Superficie"
            v-model="model.balconyOrTerraceArea"
            :disabled="props.disabled"
            v-bind="fieldState('balconyOrTerraceArea')"
          />
          <TextareaWithLabel
            name="adoption-balcony-security"
            label="Sécurisation"
            v-model="model.balconySecurityDetails"
            :disabled="props.disabled"
            v-bind="fieldState('balconySecurityDetails')"
          />
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">Autres animaux</h2>
        <SelectWithLabel
          name="adoption-has-other-animals"
          label="Avez-vous d’autres animaux ?"
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
            label="Quels animaux ?"
            v-model="model.otherAnimalsDetails"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsDetails')"
          />
          <SelectWithLabel
            name="adoption-other-animals-sterilized"
            label="Sont-ils stérilisés ?"
            :options="sterilizedOptions"
            optionLabel="label"
            optionValue="value"
            v-model="model.otherAnimalsSterilized"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsSterilized')"
          />
          <InputTextWithLabel
            name="adoption-other-animals-duration"
            label="Depuis combien de temps ?"
            v-model="model.otherAnimalsOwnedDuration"
            :disabled="props.disabled"
            v-bind="fieldState('otherAnimalsOwnedDuration')"
          />
        </template>
      </div>
    </section>

    <section class="rounded-2xl border border-surface-200 bg-white p-5 shadow-sm">
      <div class="space-y-3">
        <h2 class="text-lg font-semibold text-surface-900">Compléments</h2>
        <TextareaWithLabel
          name="adoption-additional-notes"
          label="Remarques complémentaires"
          v-model="model.additionalNotes"
          :disabled="props.disabled"
          :rows="5"
          v-bind="fieldState('additionalNotes')"
        />

        <div v-if="props.showStatus">
          <SelectWithLabel
            name="adoption-processing-status"
            label="Statut"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            v-model="model.processingStatus"
            :disabled="props.disabled"
            v-bind="fieldState('processingStatus')"
          />
        </div>

        <div class="rounded-xl bg-surface-50 p-4 text-sm leading-relaxed text-surface-600">
          En validant ce formulaire, vous vous engagez à accepter l’entière responsabilité de
          l’entretien de l’animal, y compris les frais vétérinaires, la nourriture, les
          accessoires et les conséquences juridiques et pécuniaires liées à sa possession.
        </div>

        <div class="space-y-2">
          <CheckboxWithLabel
            name="adoption-responsibility-accepted"
            v-model="model.responsibilityCommitmentAccepted"
            :binary="true"
            label="Je m’engage à accepter l’entière responsabilité de l’animal."
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
