import { describe, it, expect } from 'vitest'
import { getCatImageUrl } from '@/utils/catImageUrl'

const expectedBaseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''

describe('getCatImageUrl', () => {
  it('returns absolute http urls unchanged', () => {
    expect(getCatImageUrl('http://example.com/cat.png')).toBe('http://example.com/cat.png')
  })

  it('prefixes relative urls with the API base url stripped of its /api suffix', () => {
    expect(getCatImageUrl('/uploads/cat.png')).toBe(`${expectedBaseUrl}/uploads/cat.png`)
  })
})
