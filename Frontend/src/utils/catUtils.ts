import type { Cat } from '@/models/Cat'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import { type ComposerTranslation } from 'vue-i18n'

export const getAgeInMonths = (birthDate: string) =>
  Math.floor((Date.now() - new Date(birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44))

export const isKitten = (cat: Cat) => {
  if (!cat.birthDate) return false
  return getAgeInMonths(cat.birthDate) <= 12
}

export const formatAge = (birthDate: string | null | undefined, t: ComposerTranslation) => {
  if (!birthDate) return t('adopt.age-unknown')
  const months = getAgeInMonths(birthDate)
  if (months < 12) return t('adopt.age-months', { n: months })
  return t('adopt.age-years', { n: Math.floor(months / 12) })
}

export const getCatStatusLabel = (
  status: CatStatus | null | undefined,
  t: ComposerTranslation,
) => {
  if (status === CatStatus.EN_REFUGE) return t('adopt.status-refuge')
  if (status === CatStatus.EN_FAMILLE_ACCUEIL) return t('adopt.status-accueil')
  return null
}

export const kittenLabelClass = (label: string, t: ComposerTranslation) => {
  return label === t('adopt.kitten') ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
}
