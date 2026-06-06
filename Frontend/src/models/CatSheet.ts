import type { Cat, StrapiMedia } from './Cat'
import type { User } from './User'

export interface CatSheet {
  id: number
  documentId: string
  isDuo: boolean
  cats: Cat[]
  linkedVolunteer: User | null
  backupVolunteer: User | null
  images: StrapiMedia[]
}

export interface CatSheetPostPut {
  isDuo: boolean
  cats: string[]
  linkedVolunteer: number | null
  backupVolunteer: number | null
  images?: number[]
}
