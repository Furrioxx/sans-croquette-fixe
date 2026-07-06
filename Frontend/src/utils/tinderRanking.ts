import type { Cat } from '@/models/Cat'
import type { CatSheet } from '@/models/CatSheet'

type TraitKey =
  | 'catFriendly'
  | 'dogFriendly'
  | 'childFriendly'
  | 'vaccinated'
  | 'sterilized'
  | 'identified'
  | 'decontaminate'

const TRAITS: TraitKey[] = [
  'catFriendly',
  'dogFriendly',
  'childFriendly',
  'vaccinated',
  'sterilized',
  'identified',
  'decontaminate',
]

export interface TinderPreferences {
  hasEnoughHistory: boolean
  likedMoodIds: Set<string>
  dislikedMoodIds: Set<string>
  preferDuo: boolean
  likedTraitRates: Record<TraitKey, number>
  dislikedTraitRates: Record<TraitKey, number>
  preferredStatuses: Record<string, number>
}

const traitIsPositive = (cat: Cat, trait: TraitKey): boolean => {
  const value = cat[trait]
  return value === true || value === 'yes'
}

export const scoreCatSheet = (sheet: CatSheet, prefs: TinderPreferences): number => {
  if (!prefs.hasEnoughHistory) return 0

  let score = 0

  ;(sheet.cats ?? []).forEach((cat) => {
    cat.cat_moods.forEach((mood) => {
      if (prefs.likedMoodIds.has(mood.documentId)) score += 1
      if (prefs.dislikedMoodIds.has(mood.documentId)) score -= 1
    })

    TRAITS.forEach((trait) => {
      if (traitIsPositive(cat, trait)) {
        score += (prefs.likedTraitRates[trait] - prefs.dislikedTraitRates[trait]) * 2
      }
    })

    if (cat.catStatus) {
      score += (prefs.preferredStatuses[cat.catStatus] ?? 0) * 0.2
    }
  })

  if (sheet.isDuo === prefs.preferDuo) score += 2

  return score
}

export const weightedShuffle = <T>(items: T[], scores: number[]): T[] => {
  if (!items.length) return []
  const minScore = Math.min(...scores)
  const weights = scores.map((s) => s - minScore + 1)

  return items
    .map((item, i) => ({ item, key: Math.random() ** (1 / (weights[i] ?? 1)) }))
    .sort((a, b) => b.key - a.key)
    .map((k) => k.item)
}
