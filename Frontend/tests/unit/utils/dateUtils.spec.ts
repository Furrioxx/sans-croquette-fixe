import { describe, it, expect } from 'vitest'
import { DateUtils } from '@/utils/dateUtils'

const expectedFormat = (date: Date) => {
  const datePart = new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
  return `${datePart} à ${timePart.replace(':', 'h')}`
}

describe('DateUtils.formatDate', () => {
  it('formats an ISO date string using the fr-FR locale', () => {
    const date = new Date('2024-03-15T14:30:00Z')
    expect(DateUtils.formatDate('2024-03-15T14:30:00Z')).toBe(expectedFormat(date))
  })

  it('accepts a Date instance', () => {
    const date = new Date('2024-03-15T14:30:00Z')
    expect(DateUtils.formatDate(date)).toBe(expectedFormat(date))
  })
})
