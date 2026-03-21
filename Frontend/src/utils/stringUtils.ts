import type { FormError } from '@/models/FormError'

export const StringUtils = {
  isValueValid: (value: string, length?: number): boolean => {
    return value != null && value != undefined && value.length > (length ? length : 0)
  },

  checkInputTextValidity: (
    id: string,
    value: string,
    message?: string,
    length?: number,
  ): FormError => {
    if (!StringUtils.isValueValid(value, length)) {
      return {
        inputId: id,
        valid: false,
        message: message,
      }
    } else {
      return {
        inputId: id,
        valid: true,
      }
    }
  },

  checkRequiredValidity: (id: string, value: string | null | undefined, message?: string): FormError => {
    if (value == null || value === '') {
      return { inputId: id, valid: false, message }
    }
    return { inputId: id, valid: true }
  },

  checkArrayValidity: (id: string, value: unknown[], message?: string): FormError => {
    if (!value || value.length === 0) {
      return { inputId: id, valid: false, message }
    }
    return { inputId: id, valid: true }
  },

  checkNumberValidity: (id: string, value: number | null | undefined, message?: string, min = 1): FormError => {
    if (value == null || value < min) {
      return { inputId: id, valid: false, message }
    }
    return { inputId: id, valid: true }
  },

  getFieldError: (errors: FormError[], fieldName: string) =>
    errors.find((x) => x.inputId === fieldName),
}
