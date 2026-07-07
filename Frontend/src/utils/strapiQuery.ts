export type StrapiQueryValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | StrapiQueryValue[]
  | readonly StrapiQueryValue[]
  | { [key: string]: StrapiQueryValue }

const appendValue = (params: URLSearchParams, key: string, value: StrapiQueryValue): void => {
  if (value === undefined) {
    return
  }

  if (value === null) {
    params.append(key, 'null')
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => {
      appendValue(params, `${key}[${index}]`, item)
    })
    return
  }

  if (typeof value === 'object') {
    Object.entries(value).forEach(([childKey, childValue]) => {
      appendValue(params, `${key}[${childKey}]`, childValue)
    })
    return
  }

  params.append(key, String(value))
}

export const toStrapiQueryString = (query: Record<string, StrapiQueryValue>) => {
  const params = new URLSearchParams()

  Object.entries(query).forEach(([key, value]) => {
    appendValue(params, key, value)
  })

  return params.toString()
}
