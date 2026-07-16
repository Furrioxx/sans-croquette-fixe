import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAgeInMonths, isKitten, formatAge, getCatStatusLabel } from '@/utils/catUtils'
import { CatStatus } from '@/models/Enums/CatStatusEnum'
import type { Cat } from '@/models/Cat'
import type { ComposerTranslation } from 'vue-i18n'

const t = ((key: string, params?: Record<string, unknown>) =>
  params ? `${key}:${JSON.stringify(params)}` : key) as ComposerTranslation

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(new Date('2024-06-15T00:00:00Z'))
})

afterEach(() => {
  vi.useRealTimers()
})

describe('getAgeInMonths', () => {
  it('computes the number of months since the birth date', () => {
    expect(getAgeInMonths('2024-03-15T00:00:00Z')).toBe(3)
  })
})

describe('isKitten', () => {
  it('is true when the cat is 12 months old or younger', () => {
    const cat = { birthDate: '2024-03-15T00:00:00Z' } as Cat
    expect(isKitten(cat)).toBe(true)
  })

  it('is false when the cat is older than 12 months', () => {
    const cat = { birthDate: '2020-01-01T00:00:00Z' } as Cat
    expect(isKitten(cat)).toBe(false)
  })

  it('is false when there is no birth date', () => {
    const cat = { birthDate: null } as Cat
    expect(isKitten(cat)).toBe(false)
  })
})

describe('formatAge', () => {
  it('returns the unknown-age label when there is no birth date', () => {
    expect(formatAge(null, t)).toBe('adopt.age-unknown')
  })

  it('formats age in months for a cat younger than a year', () => {
    expect(formatAge('2024-03-15T00:00:00Z', t)).toBe('adopt.age-months:{"n":3}')
  })

  it('formats age in years for a cat a year old or older', () => {
    expect(formatAge('2020-01-01T00:00:00Z', t)).toBe('adopt.age-years:{"n":4}')
  })
})

describe('getCatStatusLabel', () => {
  it('returns the refuge label', () => {
    expect(getCatStatusLabel(CatStatus.EN_REFUGE, t)).toBe('adopt.status-refuge')
  })

  it('returns the foster-family label', () => {
    expect(getCatStatusLabel(CatStatus.EN_FAMILLE_ACCUEIL, t)).toBe('adopt.status-accueil')
  })

  it('returns null for statuses without a dedicated label', () => {
    expect(getCatStatusLabel(CatStatus.ADOPTE, t)).toBeNull()
    expect(getCatStatusLabel(null, t)).toBeNull()
  })
})
