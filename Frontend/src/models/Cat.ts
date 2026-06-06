import type { CatFriendly } from './Enums/CatFriendlyEnum'
import type { CatStatus } from './Enums/CatStatusEnum'
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
  vaccinated: boolean
  identified: boolean
  sterilized: boolean
  decontaminate: boolean
  dogFriendly: CatFriendly
  catFriendly: CatFriendly
  childFriendly: CatFriendly
  cat_moods: CatMood[]
  catStatus: CatStatus | null
  trappingDate: string | null
  medicalHistory: string | null
}

export interface CatPostPut {
  name: string
  birthDate: string | null
  gender: Genders
  vaccinated: boolean
  identified: boolean
  sterilized: boolean
  decontaminate: boolean
  dogFriendly: CatFriendly
  catFriendly: CatFriendly
  childFriendly: CatFriendly
  cat_moods: string[]
  catStatus: CatStatus | null
  trappingDate: string | null
  medicalHistory: string | null
}
