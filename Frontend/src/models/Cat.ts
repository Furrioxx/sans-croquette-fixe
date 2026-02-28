import type { CatFriendly } from './Enums/CatFriendlyEnum'
import type { Genders } from './Enums/Genders'

export interface CatMood {
  name: string
}

export interface Cat {
  id: number
  name: string
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
  moods: CatMood
}

export interface CatPostPut {
  name: string
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
  moods: CatMood | null
}
