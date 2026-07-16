import { describe, it, expect } from 'vitest'
import { slugify } from '@/utils/slugify'

describe('slugify', () => {
  it('lowercases and replaces spaces with dashes', () => {
    expect(slugify('Chat Roux')).toBe('chat-roux')
  })

  it('strips accents', () => {
    expect(slugify('Éléphant à café')).toBe('elephant-a-cafe')
  })

  it('trims leading and trailing dashes', () => {
    expect(slugify('  ---Chat!!!---  ')).toBe('chat')
  })

  it('collapses consecutive non-alphanumeric characters into a single dash', () => {
    expect(slugify('Chat & Chien')).toBe('chat-chien')
  })
})
