import type { FormError } from '@/models/FormError'

export const StringUtils = {
  isValueValid: (value: string, length?: number): boolean => {
    console.log(value, length)

    return value != null && value != undefined && value.length > (length ? length : 0)
  },

  checkInputValidity: (id: string, value: string, message?: string, length?: number): FormError => {
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

  getFieldError: (errors: FormError[], fieldName: string) =>
    errors.find((x) => x.inputId === fieldName),
}
