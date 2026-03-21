import type { CatFriendly } from './Enums/CatFriendlyEnum'
import type { Genders } from './Enums/Genders'

export interface StrapiMedia {
  id: number
  documentId: string
  name: string
  url: string
}

export interface CatMood {
  id: number
  documentId: string
  name: string
}

export interface Cat {
  id: number
  documentId: string
  name: string
  birthDate: string | null
  gender: Genders
  age: number
  vaccinated: boolean
  identified: boolean
  sterilized: boolean
  decontaminate: boolean
  dogFriendly: CatFriendly
  catFriendly: CatFriendly
  childFriendly: CatFriendly
  isDuo: boolean
  cat_moods: CatMood[]
  images: StrapiMedia[]
}

export interface CatPostPut {
  name: string
  birthDate: string | null
  gender: Genders
  age: number
  vaccinated: boolean
  identified: boolean
  sterilized: boolean
  decontaminate: boolean
  dogFriendly: CatFriendly
  catFriendly: CatFriendly
  childFriendly: CatFriendly
  isDuo: boolean
  cat_moods: string[]
  images?: number[]
}
