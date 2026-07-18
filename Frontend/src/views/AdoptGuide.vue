<script setup lang="ts">
import CatSheetCard from '@/components/CatSheetCard.vue'
import type { Cat, CatMood } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'
import { CatFriendly } from '@/models/Enums/CatFriendlyEnum'
import { Genders } from '@/models/Enums/Genders'
import { useManager } from '@/router/manager'
import { RouteNames } from '@/router/routeNames'
import { CatSheetService } from '@/services/catSheetService'
import { ADOPTABLE_STATUSES } from '@/services/catSheetService'
import { getAgeInMonths, isKitten } from '@/utils/catUtils'
import { computed, nextTick, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

type TernaryAnswer = 'yes' | 'no' | 'any'
type AgePreference = 'kitten' | 'adult' | 'any'
type GenderPreference = 'male' | 'female' | 'any'
type EnergyPreference = 'calme' | 'joueur' | 'any'
type StatusPreference = 'refuge' | 'accueil' | 'any'
type MismatchDetail = {
  expected: string
  actual: string
}
type GuideResult = {
  sheet: CatSheet
  mismatchCount: number
  mismatchDetails: MismatchDetail[]
}

const title = useManager().getCurrentRouteTitle()
const router = useRouter()
const { t } = useI18n()

const loading = ref(false)
const catSheets = ref<CatSheet[]>([])
const currentStep = ref(0)
const resultsSection = ref<HTMLElement | null>(null)

const hasChildren = ref<TernaryAnswer>('any')
const hasDog = ref<TernaryAnswer>('any')
const hasCat = ref<TernaryAnswer>('any')
const wantsDuo = ref<TernaryAnswer>('any')
const agePreference = ref<AgePreference>('any')
const genderPreference = ref<GenderPreference>('any')
const energyPreference = ref<EnergyPreference>('any')
const statusPreference = ref<StatusPreference>('any')
const vaccinatedPreference = ref<TernaryAnswer>('any')
const sterilizedPreference = ref<TernaryAnswer>('any')
const identifiedPreference = ref<TernaryAnswer>('any')
const decontaminatePreference = ref<TernaryAnswer>('any')

const guideHighlights = computed(() => [
  {
    title: t('adoptGuide.highlights.fast.title'),
    text: t('adoptGuide.highlights.fast.text'),
  },
  {
    title: t('adoptGuide.highlights.personal.title'),
    text: t('adoptGuide.highlights.personal.text'),
  },
  {
    title: t('adoptGuide.highlights.clear.title'),
    text: t('adoptGuide.highlights.clear.text'),
  },
])

const questionCards = computed(() => [
  {
    key: 'children',
    eyebrow: t('adoptGuide.steps.household.eyebrow'),
    title: t('adoptGuide.steps.household.title'),
    text: t('adoptGuide.steps.household.text'),
    model: hasChildren.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.childrenYes') },
      { value: 'no', label: t('adoptGuide.answers.childrenNo') },
      { value: 'any', label: t('adoptGuide.answers.any') },
    ],
  },
  {
    key: 'dog',
    eyebrow: t('adoptGuide.steps.animals.eyebrow'),
    title: t('adoptGuide.steps.animals.dogTitle'),
    text: t('adoptGuide.steps.animals.dogText'),
    model: hasDog.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.dogYes') },
      { value: 'no', label: t('adoptGuide.answers.dogNo') },
      { value: 'any', label: t('adoptGuide.answers.any') },
    ],
  },
  {
    key: 'cat',
    eyebrow: t('adoptGuide.steps.animals.eyebrow'),
    title: t('adoptGuide.steps.animals.catTitle'),
    text: t('adoptGuide.steps.animals.catText'),
    model: hasCat.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.catYes') },
      { value: 'no', label: t('adoptGuide.answers.catNo') },
      { value: 'any', label: t('adoptGuide.answers.any') },
    ],
  },
  {
    key: 'status',
    eyebrow: t('adoptGuide.steps.availability.eyebrow'),
    title: t('adoptGuide.steps.availability.title'),
    text: t('adoptGuide.steps.availability.text'),
    model: statusPreference.value,
    answers: [
      { value: 'refuge', label: t('adoptGuide.answers.refuge') },
      { value: 'accueil', label: t('adoptGuide.answers.foster') },
      { value: 'any', label: t('adoptGuide.answers.anyPlace') },
    ],
  },
  {
    key: 'profile',
    eyebrow: t('adoptGuide.steps.profile.eyebrow'),
    title: t('adoptGuide.steps.profile.title'),
    text: t('adoptGuide.steps.profile.text'),
    model: agePreference.value,
    answers: [
      { value: 'kitten', label: t('adoptGuide.answers.kitten') },
      { value: 'adult', label: t('adoptGuide.answers.adult') },
      { value: 'any', label: t('adoptGuide.answers.anyAge') },
    ],
  },
  {
    key: 'duo',
    eyebrow: t('adoptGuide.steps.profile.eyebrow'),
    title: t('adoptGuide.steps.profile.duoTitle'),
    text: t('adoptGuide.steps.profile.duoText'),
    model: wantsDuo.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.duoYes') },
      { value: 'no', label: t('adoptGuide.answers.duoNo') },
      { value: 'any', label: t('adoptGuide.answers.any') },
    ],
  },
  {
    key: 'gender',
    eyebrow: t('adoptGuide.steps.profile.eyebrow'),
    title: t('adoptGuide.steps.profile.genderTitle'),
    text: t('adoptGuide.steps.profile.genderText'),
    model: genderPreference.value,
    answers: [
      { value: 'female', label: t('adoptGuide.answers.female') },
      { value: 'male', label: t('adoptGuide.answers.male') },
      { value: 'any', label: t('adoptGuide.answers.anyGender') },
    ],
  },
  {
    key: 'energy',
    eyebrow: t('adoptGuide.steps.lifestyle.eyebrow'),
    title: t('adoptGuide.steps.lifestyle.title'),
    text: t('adoptGuide.steps.lifestyle.text'),
    model: energyPreference.value,
    answers: [
      { value: 'calme', label: t('adoptGuide.answers.calm') },
      { value: 'joueur', label: t('adoptGuide.answers.playful') },
      { value: 'any', label: t('adoptGuide.answers.anyEnergy') },
    ],
  },
  {
    key: 'vaccinated',
    eyebrow: t('adoptGuide.steps.health.eyebrow'),
    title: t('adoptGuide.steps.health.vaccinatedTitle'),
    text: t('adoptGuide.steps.health.vaccinatedText'),
    model: vaccinatedPreference.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.filterYes') },
      { value: 'no', label: t('adoptGuide.answers.filterNo') },
      { value: 'any', label: t('adoptGuide.answers.filterAny') },
    ],
  },
  {
    key: 'sterilized',
    eyebrow: t('adoptGuide.steps.health.eyebrow'),
    title: t('adoptGuide.steps.health.sterilizedTitle'),
    text: t('adoptGuide.steps.health.sterilizedText'),
    model: sterilizedPreference.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.filterYes') },
      { value: 'no', label: t('adoptGuide.answers.filterNo') },
      { value: 'any', label: t('adoptGuide.answers.filterAny') },
    ],
  },
  {
    key: 'identified',
    eyebrow: t('adoptGuide.steps.health.eyebrow'),
    title: t('adoptGuide.steps.health.identifiedTitle'),
    text: t('adoptGuide.steps.health.identifiedText'),
    model: identifiedPreference.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.filterYes') },
      { value: 'no', label: t('adoptGuide.answers.filterNo') },
      { value: 'any', label: t('adoptGuide.answers.filterAny') },
    ],
  },
  {
    key: 'decontaminate',
    eyebrow: t('adoptGuide.steps.health.eyebrow'),
    title: t('adoptGuide.steps.health.decontaminateTitle'),
    text: t('adoptGuide.steps.health.decontaminateText'),
    model: decontaminatePreference.value,
    answers: [
      { value: 'yes', label: t('adoptGuide.answers.filterYes') },
      { value: 'no', label: t('adoptGuide.answers.filterNo') },
      { value: 'any', label: t('adoptGuide.answers.filterAny') },
    ],
  },
])

const currentQuestion = computed(() => questionCards.value[currentStep.value])
const progressValue = computed(() => ((currentStep.value + 1) / questionCards.value.length) * 100)

const matchesBooleanPreference = (value: TernaryAnswer, field: boolean | null | undefined) => {
  if (value === 'any') return true
  if (value === 'yes') return field === true
  return field === false
}

const normalizeMood = (mood: CatMood) => mood.name.toLowerCase()

const matchesEnergy = (cat: Cat) => {
  if (energyPreference.value === 'any') return true
  const moods = (cat.cat_moods ?? []).map(normalizeMood)
  if (energyPreference.value === 'calme') {
    return moods.some((mood) => ['calme', 'independant', 'câlin', 'calin'].includes(mood))
  }
  return moods.some((mood) => ['joueur', 'sportif', 'actif', 'expressif'].includes(mood))
}

const matchesAge = (cat: Cat) => {
  if (agePreference.value === 'any') return true
  if (!cat.birthDate) return false
  return agePreference.value === 'kitten' ? isKitten(cat) : getAgeInMonths(cat.birthDate) > 12
}

const matchesGender = (cat: Cat) => {
  if (genderPreference.value === 'any') return true
  return cat.gender === (genderPreference.value === 'male' ? Genders.MALE : Genders.FEMALE)
}

const matchesDuo = (sheet: CatSheet) => {
  if (wantsDuo.value === 'any') return true
  return wantsDuo.value === 'yes' ? sheet.isDuo : !sheet.isDuo
}

const matchesStatus = (cat: Cat) => {
  if (statusPreference.value === 'any') return true
  if (statusPreference.value === 'refuge') return cat.catStatus === 'en_refuge'
  return cat.catStatus === 'en_famille_accueil'
}

const getFriendlyActualLabel = (type: 'children' | 'dog' | 'cat', value: CatFriendly | null | undefined) => {
  if (value === CatFriendly.YES) return t(`adoptGuide.actual.${type}.yes`)
  if (value === CatFriendly.NO) return t(`adoptGuide.actual.${type}.no`)
  return t(`adoptGuide.actual.${type}.unknown`)
}

const getStatusLabel = (status: string | null | undefined) => {
  if (status === 'en_refuge') return t('adopt.filter-refuge')
  if (status === 'en_famille_accueil') return t('adopt.filter-accueil')
  return t('adoptGuide.actual.status.unknown')
}

const getAgeLabel = (cat: Cat) => {
  if (!cat.birthDate) return t('adopt.age-unknown')
  return isKitten(cat) ? t('adoptGuide.answers.kitten') : t('adoptGuide.answers.adult')
}

const getGenderLabel = (gender: Genders) => {
  if (gender === Genders.MALE) return t('adoptGuide.answers.male')
  if (gender === Genders.FEMALE) return t('adoptGuide.answers.female')
  return t('adoptGuide.actual.gender.unknown')
}

const getEnergyLabel = (cat: Cat) => {
  const moods = (cat.cat_moods ?? []).map(normalizeMood)
  if (moods.some((mood) => ['joueur', 'sportif', 'actif', 'expressif'].includes(mood))) {
    return t('adoptGuide.answers.playful')
  }
  if (moods.some((mood) => ['calme', 'independant', 'câlin', 'calin'].includes(mood))) {
    return t('adoptGuide.answers.calm')
  }
  return t('adoptGuide.actual.energy.unknown')
}

const getBooleanActualLabel = (yesLabel: string, noLabel: string, value: boolean | null | undefined) =>
  value ? yesLabel : noLabel

const getCatMismatchDetails = (cat: Cat) => {
  const mismatches: MismatchDetail[] = []

  if (hasChildren.value === 'yes' && cat.childFriendly !== CatFriendly.YES) {
    mismatches.push({
      expected: t('adoptGuide.expected.children'),
      actual: getFriendlyActualLabel('children', cat.childFriendly),
    })
  }
  if (hasDog.value === 'yes' && cat.dogFriendly !== CatFriendly.YES) {
    mismatches.push({
      expected: t('adoptGuide.expected.dog'),
      actual: getFriendlyActualLabel('dog', cat.dogFriendly),
    })
  }
  if (hasCat.value === 'yes' && cat.catFriendly !== CatFriendly.YES) {
    mismatches.push({
      expected: t('adoptGuide.expected.cat'),
      actual: getFriendlyActualLabel('cat', cat.catFriendly),
    })
  }
  if (agePreference.value !== 'any' && !matchesAge(cat)) {
    mismatches.push({
      expected:
        agePreference.value === 'kitten' ? t('adoptGuide.answers.kitten') : t('adoptGuide.answers.adult'),
      actual: getAgeLabel(cat),
    })
  }
  if (genderPreference.value !== 'any' && !matchesGender(cat)) {
    mismatches.push({
      expected:
        genderPreference.value === 'male' ? t('adoptGuide.answers.male') : t('adoptGuide.answers.female'),
      actual: getGenderLabel(cat.gender),
    })
  }
  if (energyPreference.value !== 'any' && !matchesEnergy(cat)) {
    mismatches.push({
      expected:
        energyPreference.value === 'calme' ? t('adoptGuide.answers.calm') : t('adoptGuide.answers.playful'),
      actual: getEnergyLabel(cat),
    })
  }
  if (statusPreference.value !== 'any' && !matchesStatus(cat)) {
    mismatches.push({
      expected:
        statusPreference.value === 'refuge' ? t('adopt.filter-refuge') : t('adopt.filter-accueil'),
      actual: getStatusLabel(cat.catStatus),
    })
  }
  if (vaccinatedPreference.value !== 'any' && !matchesBooleanPreference(vaccinatedPreference.value, cat.vaccinated)) {
    mismatches.push({
      expected:
        vaccinatedPreference.value === 'yes'
          ? t('adopt.filter-vaccinated')
          : t('adoptGuide.answers.notVaccinated'),
      actual: getBooleanActualLabel(
        t('adopt.filter-vaccinated'),
        t('adoptGuide.answers.notVaccinated'),
        cat.vaccinated,
      ),
    })
  }
  if (sterilizedPreference.value !== 'any' && !matchesBooleanPreference(sterilizedPreference.value, cat.sterilized)) {
    mismatches.push({
      expected:
        sterilizedPreference.value === 'yes'
          ? t('adopt.filter-sterilized')
          : t('adoptGuide.answers.notSterilized'),
      actual: getBooleanActualLabel(
        t('adopt.filter-sterilized'),
        t('adoptGuide.answers.notSterilized'),
        cat.sterilized,
      ),
    })
  }
  if (identifiedPreference.value !== 'any' && !matchesBooleanPreference(identifiedPreference.value, cat.identified)) {
    mismatches.push({
      expected:
        identifiedPreference.value === 'yes'
          ? t('adopt.filter-identified')
          : t('adoptGuide.answers.notIdentified'),
      actual: getBooleanActualLabel(
        t('adopt.filter-identified'),
        t('adoptGuide.answers.notIdentified'),
        cat.identified,
      ),
    })
  }
  if (
    decontaminatePreference.value !== 'any' &&
    !matchesBooleanPreference(decontaminatePreference.value, cat.decontaminate)
  ) {
    mismatches.push({
      expected:
        decontaminatePreference.value === 'yes'
          ? t('adopt.filter-decontaminated')
          : t('adoptGuide.answers.notDecontaminated'),
      actual: getBooleanActualLabel(
        t('adopt.filter-decontaminated'),
        t('adoptGuide.answers.notDecontaminated'),
        cat.decontaminate,
      ),
    })
  }

  return mismatches
}

const getSheetMismatchDetails = (sheet: CatSheet) => {
  const sheetMismatches: MismatchDetail[] = []
  if (wantsDuo.value !== 'any' && !matchesDuo(sheet)) {
    sheetMismatches.push({
      expected: wantsDuo.value === 'yes' ? t('adoptGuide.answers.duoYes') : t('adoptGuide.answers.duoNo'),
      actual: sheet.isDuo ? t('adoptGuide.answers.duoYes') : t('adoptGuide.answers.duoNo'),
    })
  }

  const eligibleCats = sheet.cats.filter((cat) => ADOPTABLE_STATUSES.includes(cat.catStatus ?? ''))
  if (!eligibleCats.length) return sheetMismatches

  const bestCatMismatches = eligibleCats
    .map((cat) => getCatMismatchDetails(cat))
    .sort((left, right) => left.length - right.length)[0]

  return [...sheetMismatches, ...(bestCatMismatches ?? [])]
}

const guideResults = computed<GuideResult[]>(() =>
  catSheets.value
    .map((sheet) => {
      const mismatchDetails = getSheetMismatchDetails(sheet)
      return {
        sheet,
        mismatchCount: mismatchDetails.length,
        mismatchDetails,
      }
    })
    .filter((result) => result.sheet.cats.some((cat) => ADOPTABLE_STATUSES.includes(cat.catStatus ?? '')))
    .filter((result) => result.mismatchCount <= 2)
    .sort((left, right) => left.mismatchCount - right.mismatchCount),
)

const exactResults = computed(() => guideResults.value.filter((result) => result.mismatchCount === 0))
const closeResults = computed(() => guideResults.value.filter((result) => result.mismatchCount > 0).slice(0, 10))

const resultChips = computed(() => {
  const chips: string[] = []
  if (hasChildren.value === 'yes') chips.push(t('adoptGuide.answers.childrenYes'))
  if (hasDog.value === 'yes') chips.push(t('adoptGuide.answers.dogYes'))
  if (hasCat.value === 'yes') chips.push(t('adoptGuide.answers.catYes'))
  if (wantsDuo.value === 'yes') chips.push(t('adoptGuide.answers.duoYes'))
  if (wantsDuo.value === 'no') chips.push(t('adoptGuide.answers.duoNo'))
  if (statusPreference.value === 'refuge') chips.push(t('adoptGuide.answers.refuge'))
  if (statusPreference.value === 'accueil') chips.push(t('adoptGuide.answers.foster'))
  if (agePreference.value === 'kitten') chips.push(t('adoptGuide.answers.kitten'))
  if (agePreference.value === 'adult') chips.push(t('adoptGuide.answers.adult'))
  if (genderPreference.value === 'female') chips.push(t('adoptGuide.answers.female'))
  if (genderPreference.value === 'male') chips.push(t('adoptGuide.answers.male'))
  if (energyPreference.value === 'calme') chips.push(t('adoptGuide.answers.calm'))
  if (energyPreference.value === 'joueur') chips.push(t('adoptGuide.answers.playful'))
  if (vaccinatedPreference.value === 'yes') chips.push(t('adopt.filter-vaccinated'))
  if (vaccinatedPreference.value === 'no') chips.push(t('adoptGuide.answers.notVaccinated'))
  if (sterilizedPreference.value === 'yes') chips.push(t('adopt.filter-sterilized'))
  if (sterilizedPreference.value === 'no') chips.push(t('adoptGuide.answers.notSterilized'))
  if (identifiedPreference.value === 'yes') chips.push(t('adopt.filter-identified'))
  if (identifiedPreference.value === 'no') chips.push(t('adoptGuide.answers.notIdentified'))
  if (decontaminatePreference.value === 'yes') chips.push(t('adopt.filter-decontaminated'))
  if (decontaminatePreference.value === 'no') chips.push(t('adoptGuide.answers.notDecontaminated'))
  return chips
})

const setAnswer = (questionKey: string, value: string) => {
  if (questionKey === 'children') hasChildren.value = value as TernaryAnswer
  if (questionKey === 'dog') hasDog.value = value as TernaryAnswer
  if (questionKey === 'cat') hasCat.value = value as TernaryAnswer
  if (questionKey === 'profile') agePreference.value = value as AgePreference
  if (questionKey === 'duo') wantsDuo.value = value as TernaryAnswer
  if (questionKey === 'gender') genderPreference.value = value as GenderPreference
  if (questionKey === 'energy') energyPreference.value = value as EnergyPreference
  if (questionKey === 'status') statusPreference.value = value as StatusPreference
  if (questionKey === 'vaccinated') vaccinatedPreference.value = value as TernaryAnswer
  if (questionKey === 'sterilized') sterilizedPreference.value = value as TernaryAnswer
  if (questionKey === 'identified') identifiedPreference.value = value as TernaryAnswer
  if (questionKey === 'decontaminate') decontaminatePreference.value = value as TernaryAnswer
}

const goNext = async () => {
  if (currentStep.value < questionCards.value.length - 1) {
    currentStep.value += 1
    return
  }

  await nextTick()
  resultsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const goPrevious = () => {
  if (currentStep.value > 0) currentStep.value -= 1
}

const resetGuide = () => {
  currentStep.value = 0
  hasChildren.value = 'any'
  hasDog.value = 'any'
  hasCat.value = 'any'
  wantsDuo.value = 'any'
  agePreference.value = 'any'
  genderPreference.value = 'any'
  energyPreference.value = 'any'
  statusPreference.value = 'any'
  vaccinatedPreference.value = 'any'
  sterilizedPreference.value = 'any'
  identifiedPreference.value = 'any'
  decontaminatePreference.value = 'any'
}

onMounted(async () => {
  loading.value = true
  try {
    const response = await CatSheetService.GetPublicCatSheets({ page: 1, pageSize: 100 })
    catSheets.value = response.data.data
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="flex w-full flex-col">
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-12 pt-14 sm:px-6 md:px-[60px] md:pb-16"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-20 h-[280px] w-[280px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative grid gap-6 md:gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
        <div class="space-y-5">
          <div class="space-y-4">
            <h1 class="display-font text-3xl font-semibold leading-tight sm:text-4xl md:text-6xl">
              {{ title }}
            </h1>
            <p class="max-w-2xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
              {{ $t('adoptGuide.subtitle') }}
            </p>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="point in guideHighlights"
              :key="point.title"
              class="rounded-[22px] bg-white p-4 sm:p-5"
            >
              <p class="display-font text-lg font-semibold">{{ point.title }}</p>
              <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">{{ point.text }}</p>
            </article>
          </div>

          <div class="responsive-actions">
            <Button
              :label="$t('adoptGuide.fullListCta')"
              icon="pi pi-list"
              rounded
              @click="router.push({ name: RouteNames.ADOPT })"
            />
            <Button
              :label="$t('adoptGuide.resetCta')"
              icon="pi pi-refresh"
              severity="secondary"
              outlined
              rounded
              @click="resetGuide"
            />
          </div>
        </div>

        <div class="section-card rounded-[26px] p-4 sm:p-6 md:rounded-[30px] md:p-7">
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <div>
              <p class="text-sm font-semibold text-[var(--scf-muted)]">
                {{ $t('adoptGuide.progress', { current: currentStep + 1, total: questionCards.length }) }}
              </p>
            </div>
            <span class="text-sm font-semibold text-[var(--scf-accent-dark)]">
              {{ Math.round(progressValue) }}%
            </span>
          </div>

          <div class="mt-4 h-2 rounded-full bg-[var(--scf-line)]">
            <div
              class="h-full rounded-full bg-[var(--scf-accent)] transition-all duration-300"
              :style="{ width: `${progressValue}%` }"
            ></div>
          </div>

          <div v-if="currentQuestion" class="mt-6 space-y-6">
            <div class="space-y-3">
              <h2 class="display-font text-2xl font-semibold leading-tight sm:text-3xl">
                {{ currentQuestion.title }}
              </h2>
              <p class="text-sm leading-7 text-[var(--scf-text)] md:text-base">
                {{ currentQuestion.text }}
              </p>
            </div>

            <div class="grid gap-3">
              <button
                v-for="answer in currentQuestion.answers"
                :key="answer.value"
                type="button"
                class="rounded-[22px] border px-4 py-3.5 text-left text-sm font-semibold leading-6 transition-colors sm:py-4"
                :class="
                  currentQuestion.model === answer.value
                    ? 'border-[var(--scf-accent)] bg-[var(--scf-accent-soft)] text-[var(--scf-accent-dark)]'
                    : 'border-[var(--scf-line)] bg-white text-[var(--scf-ink)] hover:border-[var(--scf-accent)]/40'
                "
                @click="setAnswer(currentQuestion.key, answer.value)"
              >
                {{ answer.label }}
              </button>
            </div>

            <div class="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-between">
              <Button
                :label="$t('adoptGuide.previous')"
                icon="pi pi-arrow-left"
                severity="secondary"
                outlined
                rounded
                :disabled="currentStep === 0"
                @click="goPrevious"
              />
              <Button
                :label="currentStep === questionCards.length - 1 ? $t('adoptGuide.seeResults') : $t('adoptGuide.next')"
                icon="pi pi-arrow-right"
                iconPos="right"
                rounded
                @click="goNext"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section ref="resultsSection" class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="responsive-split-header gap-6">
          <div class="space-y-3">
            <h2 class="display-font text-3xl font-semibold md:text-4xl">
              {{ $t('adoptGuide.resultsTitle') }}
            </h2>
            <p class="max-w-2xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
              {{ $t('adoptGuide.resultsText') }}
            </p>
          </div>
          <Button
            :label="$t('adoptGuide.fullListCta')"
            icon="pi pi-sliders-h"
            severity="secondary"
            outlined
            rounded
            @click="router.push({ name: RouteNames.ADOPT })"
          />
        </div>

        <div v-if="resultChips.length" class="flex flex-wrap gap-2">
          <span
            v-for="chip in resultChips"
            :key="chip"
            class="rounded-full bg-[var(--scf-accent-soft)] px-3 py-1.5 text-sm font-semibold text-[var(--scf-accent-dark)]"
          >
            {{ chip }}
          </span>
        </div>

        <div v-if="loading" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="index in 6"
            :key="index"
            class="animate-pulse overflow-hidden rounded-[22px] bg-[var(--scf-bg)]"
          >
            <div class="aspect-[4/3] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-4 w-1/2 rounded bg-white"></div>
              <div class="h-3 w-2/3 rounded bg-white"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="guideResults.length === 0"
          class="rounded-[26px] bg-[var(--scf-bg)] px-5 py-14 text-center sm:px-6"
        >
          <div
            class="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[var(--scf-accent-soft)] text-[var(--scf-accent-dark)]"
          >
            <i class="pi pi-heart text-2xl"></i>
          </div>
          <h3 class="display-font mt-5 text-2xl font-semibold">{{ $t('adoptGuide.emptyTitle') }}</h3>
          <p class="mx-auto mt-3 max-w-xl text-sm leading-7 text-[var(--scf-text)] md:text-base">
            {{ $t('adoptGuide.emptyText') }}
          </p>
          <div class="responsive-actions mt-6 justify-center">
            <Button
              :label="$t('adoptGuide.resetCta')"
              icon="pi pi-refresh"
              rounded
              @click="resetGuide"
            />
            <Button
              :label="$t('adoptGuide.fullListCta')"
              icon="pi pi-list"
              severity="secondary"
              outlined
              rounded
              @click="router.push({ name: RouteNames.ADOPT })"
            />
          </div>
        </div>

        <div v-else class="space-y-10">
          <div class="space-y-5">
            <div class="space-y-2">
              <h3 class="display-font text-2xl font-semibold">{{ $t('adoptGuide.perfectMatchesTitle') }}</h3>
              <p class="text-sm leading-6 text-[var(--scf-text)]">
                {{
                  exactResults.length
                    ? $t('adoptGuide.perfectMatchesText')
                    : $t('adoptGuide.noPerfectMatchesText')
                }}
              </p>
            </div>

            <div v-if="exactResults.length" class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="result in exactResults"
                :key="result.sheet.documentId"
                class="min-w-0 space-y-3"
              >
                <CatSheetCard :catSheet="result.sheet" />
              </article>
            </div>
            <div
              v-else
              class="rounded-[22px] border border-dashed border-[var(--scf-line)] bg-[var(--scf-bg)] px-5 py-6 text-sm text-[var(--scf-text)]"
            >
              {{ $t('adoptGuide.noPerfectMatchesBox') }}
            </div>
          </div>

          <div v-if="closeResults.length" class="space-y-5">
            <div class="space-y-2">
              <h3 class="display-font text-2xl font-semibold">{{ $t('adoptGuide.closeMatchesTitle') }}</h3>
              <p class="text-sm leading-6 text-[var(--scf-text)]">{{ $t('adoptGuide.closeMatchesText') }}</p>
            </div>

            <div class="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <article
                v-for="result in closeResults"
                :key="result.sheet.documentId"
                class="min-w-0 space-y-3"
              >
                <CatSheetCard :catSheet="result.sheet" :mismatch-details="result.mismatchDetails" />
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
