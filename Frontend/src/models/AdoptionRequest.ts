import type { CatSheet } from './CatSheet'
import type { User } from './User'

export type BooleanChoice = boolean | null
export type YesNoOther = 'oui' | 'non' | 'autre' | null
export type HouseholdComposition = 'seul' | 'couple' | 'colocation' | 'autre' | null
export type HousingType = 'appartement' | 'maison' | 'autre' | null
export type LivingSpaceType = 'interieur' | 'exterieur' | 'les_deux' | 'autre' | null
export type EnvironmentType = 'ville' | 'campagne' | 'lotissement' | 'autre' | null
export type OtherAnimalsSterilized = 'oui' | 'non' | 'partiellement' | 'non_applicable' | null
export type AdoptionProcessingStatus = 'pending' | 'in_review' | 'approved' | 'rejected'

export interface AdoptionRequest {
  id: number
  documentId: string
  createdAt: string
  updatedAt: string
  publishedAt: string | null
  agreementAccepted: boolean
  animalName: string
  firstName: string
  lastName: string
  birthDate: string
  streetAddress: string
  postalCode: string
  city: string
  phone: string
  email: string
  householdComposition: HouseholdComposition
  householdCompositionOther: string | null
  roommateCount: number | null
  hasChildren: boolean
  childrenCount: number | null
  childrenAges: string | null
  householdAgreement: boolean
  householdDisagreementReason: string | null
  isEmployed: boolean
  profession: string | null
  workSchedule: string | null
  aloneTimePerDay: string
  housingType: HousingType
  housingTypeOther: string | null
  housingArea: string
  animalLivingSpace: LivingSpaceType
  animalLivingSpaceOther: string | null
  environmentType: EnvironmentType
  environmentTypeOther: string | null
  nearBusyRoad: YesNoOther
  nearBusyRoadOther: string | null
  canGoOutside: YesNoOther
  canGoOutsideOther: string | null
  apartmentFloor: string | null
  windowsSecured: YesNoOther
  windowsSecuredOther: string | null
  plansToSecureWindows: boolean | null
  hasGarden: YesNoOther
  hasGardenOther: string | null
  livingPlaceDetails: string | null
  gardenArea: string | null
  gardenFencedDetails: string | null
  hasBalconyOrTerrace: YesNoOther
  balconyOrTerraceArea: string | null
  balconySecurityDetails: string | null
  hasOtherAnimals: boolean
  otherAnimalsDetails: string | null
  otherAnimalsSterilized: OtherAnimalsSterilized
  otherAnimalsOwnedDuration: string | null
  additionalNotes: string | null
  responsibilityCommitmentAccepted: boolean
  processingStatus: AdoptionProcessingStatus
  catSheet: CatSheet | null
  submittedBy: User | null
}

export interface AdoptionRequestFormValues {
  agreementAccepted: boolean
  animalName: string
  firstName: string
  lastName: string
  birthDate: string | null
  streetAddress: string
  postalCode: string
  city: string
  phone: string
  email: string
  householdComposition: HouseholdComposition
  householdCompositionOther: string | null
  roommateCount: number | null
  hasChildren: BooleanChoice
  childrenCount: number | null
  childrenAges: string | null
  householdAgreement: BooleanChoice
  householdDisagreementReason: string | null
  isEmployed: BooleanChoice
  profession: string | null
  workSchedule: string | null
  aloneTimePerDay: string
  housingType: HousingType
  housingTypeOther: string | null
  housingArea: string
  animalLivingSpace: LivingSpaceType
  animalLivingSpaceOther: string | null
  environmentType: EnvironmentType
  environmentTypeOther: string | null
  nearBusyRoad: YesNoOther
  nearBusyRoadOther: string | null
  canGoOutside: YesNoOther
  canGoOutsideOther: string | null
  apartmentFloor: string | null
  windowsSecured: YesNoOther
  windowsSecuredOther: string | null
  plansToSecureWindows: BooleanChoice
  hasGarden: YesNoOther
  hasGardenOther: string | null
  livingPlaceDetails: string | null
  gardenArea: string | null
  gardenFencedDetails: string | null
  hasBalconyOrTerrace: YesNoOther
  balconyOrTerraceArea: string | null
  balconySecurityDetails: string | null
  hasOtherAnimals: BooleanChoice
  otherAnimalsDetails: string | null
  otherAnimalsSterilized: OtherAnimalsSterilized
  otherAnimalsOwnedDuration: string | null
  additionalNotes: string | null
  responsibilityCommitmentAccepted: boolean
  processingStatus: AdoptionProcessingStatus
  catSheet: string | null
}

export const createEmptyAdoptionRequestForm = (
  catSheetDocumentId: string | null = null,
  animalName = '',
): AdoptionRequestFormValues => ({
  agreementAccepted: false,
  animalName,
  firstName: '',
  lastName: '',
  birthDate: null,
  streetAddress: '',
  postalCode: '',
  city: '',
  phone: '',
  email: '',
  householdComposition: null,
  householdCompositionOther: null,
  roommateCount: null,
  hasChildren: null,
  childrenCount: null,
  childrenAges: null,
  householdAgreement: null,
  householdDisagreementReason: null,
  isEmployed: null,
  profession: null,
  workSchedule: null,
  aloneTimePerDay: '',
  housingType: null,
  housingTypeOther: null,
  housingArea: '',
  animalLivingSpace: null,
  animalLivingSpaceOther: null,
  environmentType: null,
  environmentTypeOther: null,
  nearBusyRoad: null,
  nearBusyRoadOther: null,
  canGoOutside: null,
  canGoOutsideOther: null,
  apartmentFloor: null,
  windowsSecured: null,
  windowsSecuredOther: null,
  plansToSecureWindows: null,
  hasGarden: null,
  hasGardenOther: null,
  livingPlaceDetails: null,
  gardenArea: null,
  gardenFencedDetails: null,
  hasBalconyOrTerrace: null,
  balconyOrTerraceArea: null,
  balconySecurityDetails: null,
  hasOtherAnimals: null,
  otherAnimalsDetails: null,
  otherAnimalsSterilized: null,
  otherAnimalsOwnedDuration: null,
  additionalNotes: null,
  responsibilityCommitmentAccepted: false,
  processingStatus: 'pending',
  catSheet: catSheetDocumentId,
})

export const createAdoptionRequestFormFromRequest = (request: AdoptionRequest): AdoptionRequestFormValues => ({
  agreementAccepted: request.agreementAccepted,
  animalName: request.animalName,
  firstName: request.firstName,
  lastName: request.lastName,
  birthDate: request.birthDate,
  streetAddress: request.streetAddress,
  postalCode: request.postalCode,
  city: request.city,
  phone: request.phone,
  email: request.email,
  householdComposition: request.householdComposition,
  householdCompositionOther: request.householdCompositionOther,
  roommateCount: request.roommateCount,
  hasChildren: request.hasChildren,
  childrenCount: request.childrenCount,
  childrenAges: request.childrenAges,
  householdAgreement: request.householdAgreement,
  householdDisagreementReason: request.householdDisagreementReason,
  isEmployed: request.isEmployed,
  profession: request.profession,
  workSchedule: request.workSchedule,
  aloneTimePerDay: request.aloneTimePerDay,
  housingType: request.housingType,
  housingTypeOther: request.housingTypeOther,
  housingArea: request.housingArea,
  animalLivingSpace: request.animalLivingSpace,
  animalLivingSpaceOther: request.animalLivingSpaceOther,
  environmentType: request.environmentType,
  environmentTypeOther: request.environmentTypeOther,
  nearBusyRoad: request.nearBusyRoad,
  nearBusyRoadOther: request.nearBusyRoadOther,
  canGoOutside: request.canGoOutside,
  canGoOutsideOther: request.canGoOutsideOther,
  apartmentFloor: request.apartmentFloor,
  windowsSecured: request.windowsSecured,
  windowsSecuredOther: request.windowsSecuredOther,
  plansToSecureWindows: request.plansToSecureWindows,
  hasGarden: request.hasGarden,
  hasGardenOther: request.hasGardenOther,
  livingPlaceDetails: request.livingPlaceDetails,
  gardenArea: request.gardenArea,
  gardenFencedDetails: request.gardenFencedDetails,
  hasBalconyOrTerrace: request.hasBalconyOrTerrace,
  balconyOrTerraceArea: request.balconyOrTerraceArea,
  balconySecurityDetails: request.balconySecurityDetails,
  hasOtherAnimals: request.hasOtherAnimals,
  otherAnimalsDetails: request.otherAnimalsDetails,
  otherAnimalsSterilized: request.otherAnimalsSterilized,
  otherAnimalsOwnedDuration: request.otherAnimalsOwnedDuration,
  additionalNotes: request.additionalNotes,
  responsibilityCommitmentAccepted: request.responsibilityCommitmentAccepted,
  processingStatus: request.processingStatus,
  catSheet: request.catSheet?.documentId ?? null,
})
