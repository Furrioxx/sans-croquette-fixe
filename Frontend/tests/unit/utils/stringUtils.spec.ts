import { describe, it, expect } from 'vitest'
import { StringUtils } from '@/utils/stringUtils'

describe('StringUtils.isValueValid', () => {
  it('returns false for an empty string', () => {
    expect(StringUtils.isValueValid('')).toBe(false)
  })

  it('returns true for a non-empty string', () => {
    expect(StringUtils.isValueValid('chat')).toBe(true)
  })

  it('respects a custom minimum length', () => {
    expect(StringUtils.isValueValid('ab', 2)).toBe(false)
    expect(StringUtils.isValueValid('abc', 2)).toBe(true)
  })
})

describe('StringUtils.checkInputTextValidity', () => {
  it('marks the field invalid with the given message when too short', () => {
    expect(StringUtils.checkInputTextValidity('name', '', 'Required')).toEqual({
      inputId: 'name',
      valid: false,
      message: 'Required',
    })
  })

  it('marks the field valid when non-empty', () => {
    expect(StringUtils.checkInputTextValidity('name', 'chat')).toEqual({
      inputId: 'name',
      valid: true,
    })
  })
})

describe('StringUtils.checkRequiredValidity', () => {
  it('is invalid for null, undefined and empty string', () => {
    expect(StringUtils.checkRequiredValidity('id', null).valid).toBe(false)
    expect(StringUtils.checkRequiredValidity('id', undefined).valid).toBe(false)
    expect(StringUtils.checkRequiredValidity('id', '').valid).toBe(false)
  })

  it('is valid for a non-empty value', () => {
    expect(StringUtils.checkRequiredValidity('id', 'chat').valid).toBe(true)
  })
})

describe('StringUtils.checkArrayValidity', () => {
  it('is invalid for an empty array', () => {
    expect(StringUtils.checkArrayValidity('ids', []).valid).toBe(false)
  })

  it('is valid for a non-empty array', () => {
    expect(StringUtils.checkArrayValidity('ids', ['a']).valid).toBe(true)
  })
})

describe('StringUtils.checkNumberValidity', () => {
  it('is invalid below the minimum', () => {
    expect(StringUtils.checkNumberValidity('age', 0).valid).toBe(false)
  })

  it('is valid at or above the minimum', () => {
    expect(StringUtils.checkNumberValidity('age', 1).valid).toBe(true)
  })

  it('respects a custom minimum', () => {
    expect(StringUtils.checkNumberValidity('age', 5, undefined, 10).valid).toBe(false)
  })
})

describe('StringUtils.getFieldError', () => {
  it('finds the error matching the given field name', () => {
    const errors = [
      { inputId: 'name', valid: false, message: 'Required' },
      { inputId: 'email', valid: true },
    ]
    expect(StringUtils.getFieldError(errors, 'name')).toEqual(errors[0])
  })

  it('returns undefined when no error matches', () => {
    const errors = [{ inputId: 'name', valid: false, message: 'Required' }]
    expect(StringUtils.getFieldError(errors, 'email')).toBeUndefined()
  })
})
