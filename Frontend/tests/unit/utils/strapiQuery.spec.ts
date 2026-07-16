import { describe, it, expect } from 'vitest'
import { toStrapiQueryString } from '@/utils/strapiQuery'

describe('toStrapiQueryString', () => {
  it('serializes primitive values', () => {
    expect(toStrapiQueryString({ page: 1, name: 'chat' })).toBe('page=1&name=chat')
  })

  it('skips undefined values', () => {
    expect(toStrapiQueryString({ page: 1, name: undefined })).toBe('page=1')
  })

  it('serializes null as the literal string "null"', () => {
    expect(toStrapiQueryString({ status: null })).toBe('status=null')
  })

  it('serializes arrays with indexed bracket keys', () => {
    expect(toStrapiQueryString({ ids: ['a', 'b'] })).toBe('ids%5B0%5D=a&ids%5B1%5D=b')
  })

  it('serializes nested objects with bracket keys', () => {
    expect(toStrapiQueryString({ filters: { name: 'chat' } })).toBe('filters%5Bname%5D=chat')
  })
})
