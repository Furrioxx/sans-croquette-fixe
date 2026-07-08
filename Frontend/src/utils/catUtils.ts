import type { Cat } from '@/models/Cat'
import { type ComposerTranslation } from 'vue-i18n'

export const isKitten = (cat: Cat) => {
  if (!cat.birthDate) return false
  const months = Math.floor(
    (Date.now() - new Date(cat.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30.44),
  )
  return months <= 12
}

export const kittenLabelClass = (label: string, t: ComposerTranslation) => {
  return label === t('adopt.kitten') ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
}
