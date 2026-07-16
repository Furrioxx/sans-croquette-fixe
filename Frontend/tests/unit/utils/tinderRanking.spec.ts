import { describe, it, expect, vi } from 'vitest'
import { scoreCatSheet, weightedShuffle, type TinderPreferences } from '@/utils/tinderRanking'
import type { CatSheet } from '@/models/CatSheet'
import type { Cat } from '@/models/Cat'

const emptyTraitRates = {
  catFriendly: 0,
  dogFriendly: 0,
  childFriendly: 0,
  vaccinated: 0,
  sterilized: 0,
  identified: 0,
  decontaminate: 0,
}

const buildPrefs = (overrides: Partial<TinderPreferences> = {}): TinderPreferences => ({
  hasEnoughHistory: true,
  likedMoodIds: new Set(),
  dislikedMoodIds: new Set(),
  preferDuo: false,
  likedTraitRates: { ...emptyTraitRates },
  dislikedTraitRates: { ...emptyTraitRates },
  preferredStatuses: {},
  ...overrides,
})

const buildCat = (overrides: Partial<Cat> = {}): Cat =>
  ({
    cat_moods: [],
    ...overrides,
  }) as Cat

describe('scoreCatSheet', () => {
  it('returns 0 when there is not enough history', () => {
    const sheet = { cats: [], isDuo: false } as unknown as CatSheet
    expect(scoreCatSheet(sheet, buildPrefs({ hasEnoughHistory: false }))).toBe(0)
  })

  it('adds points for liked moods and subtracts for disliked moods', () => {
    const sheet = {
      cats: [buildCat({ cat_moods: [{ documentId: 'liked' }, { documentId: 'disliked' }] as any })],
      isDuo: true,
    } as unknown as CatSheet
    const prefs = buildPrefs({
      preferDuo: false,
      likedMoodIds: new Set(['liked']),
      dislikedMoodIds: new Set(['disliked']),
    })
    expect(scoreCatSheet(sheet, prefs)).toBe(0)
  })

  it('weights liked traits positively based on the trait rate', () => {
    const sheet = {
      cats: [buildCat({ catFriendly: true as any })],
      isDuo: true,
    } as unknown as CatSheet
    const prefs = buildPrefs({
      preferDuo: false,
      likedTraitRates: { ...emptyTraitRates, catFriendly: 0.5 },
    })
    expect(scoreCatSheet(sheet, prefs)).toBe(1)
  })

  it('gives a bonus when the sheet duo status matches the preference', () => {
    const sheet = { cats: [], isDuo: true } as unknown as CatSheet
    expect(scoreCatSheet(sheet, buildPrefs({ preferDuo: true }))).toBe(2)
    expect(scoreCatSheet(sheet, buildPrefs({ preferDuo: false }))).toBe(0)
  })
})

describe('weightedShuffle', () => {
  it('returns an empty array when given no items', () => {
    expect(weightedShuffle([], [])).toEqual([])
  })

  it('always favors the highest-scored item when randomness is neutralized', () => {
    // Math.random est mocké à une valeur fixe car weightedShuffle est probabiliste :
    // sans ce contrôle, l'ordre du résultat ne serait pas déterministe entre les runs.
    vi.spyOn(Math, 'random').mockReturnValue(0.5)
    const result = weightedShuffle(['low', 'high'], [0, 10])
    expect(result[0]).toBe('high')
    vi.restoreAllMocks()
  })
})
