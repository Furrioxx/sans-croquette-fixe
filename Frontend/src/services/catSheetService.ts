import type { CatSheetPostPut } from '@/models/CatSheet'
import { axiosInstance } from './axiosInsance'
import { toStrapiQueryString, type StrapiQueryValue } from '@/utils/strapiQuery'

const API_URL = '/cat-sheets'

export interface PublicCatSheetParams {
  page: number
  pageSize: number
  statuses?: string[]
  genders?: string[]
  isDuo?: boolean
  catFriendly?: boolean
  dogFriendly?: boolean
  childFriendly?: boolean
  vaccinated?: boolean
  sterilized?: boolean
  identified?: boolean
  decontaminate?: boolean
  excludeIds?: string[]
}

export const ADOPTABLE_STATUSES = ['en_refuge', 'en_famille_accueil']

const CAT_SHEET_POPULATE = {
  cats: { populate: { cat_moods: '*' } },
  images: true,
  tarification: true,
}

export const CatSheetService = {
  GetAllCatSheets: async () => {
    const query = toStrapiQueryString({
      populate: {
        ...CAT_SHEET_POPULATE,
        linkedVolunteer: true,
        backupVolunteer: true,
      },
      pagination: { page: 1, pageSize: 1000 },
    })
    return await axiosInstance.get(`${API_URL}?${query}`)
  },

  GetPublicCatSheets: async (params: PublicCatSheetParams) => {
    const statuses = params.statuses?.length ? params.statuses : ADOPTABLE_STATUSES

    const catsFilters: Record<string, StrapiQueryValue> = {
      catStatus: { $in: statuses },
    }
    if (params.genders?.length) catsFilters.gender = { $in: params.genders }
    if (params.catFriendly) catsFilters.catFriendly = { $eq: 'yes' }
    if (params.dogFriendly) catsFilters.dogFriendly = { $eq: 'yes' }
    if (params.childFriendly) catsFilters.childFriendly = { $eq: 'yes' }
    if (params.vaccinated) catsFilters.vaccinated = { $eq: true }
    if (params.sterilized) catsFilters.sterilized = { $eq: true }
    if (params.identified) catsFilters.identified = { $eq: true }
    if (params.decontaminate) catsFilters.decontaminate = { $eq: true }

    const filters: Record<string, StrapiQueryValue> = { cats: catsFilters }
    filters.isArchived = { $eq: false }
    if (params.isDuo !== undefined) filters.isDuo = { $eq: params.isDuo }
    if (params.excludeIds?.length) filters.documentId = { $notIn: params.excludeIds }

    const query = toStrapiQueryString({
      populate: CAT_SHEET_POPULATE,
      pagination: { page: params.page, pageSize: params.pageSize },
      filters,
    })

    return await axiosInstance.get(`${API_URL}?${query}`)
  },

  GetPublicCatSheet: async (documentId: string) => {
    const query = toStrapiQueryString({
      populate: CAT_SHEET_POPULATE,
      filters: {
        documentId: { $eq: documentId },
        isArchived: { $eq: false },
      },
      pagination: { page: 1, pageSize: 1 },
    })
    const response = await axiosInstance.get(`${API_URL}?${query}`)
    return {
      ...response,
      data: {
        ...response.data,
        data: response.data.data[0] ?? null,
      },
    }
  },

  GetCatSheetsByIds: async (documentIds: string[]) => {
    if (!documentIds.length) return { data: { data: [] } }
    const query = toStrapiQueryString({
      populate: CAT_SHEET_POPULATE,
      pagination: { pageSize: documentIds.length },
      filters: {
        documentId: { $in: documentIds },
        isArchived: { $eq: false },
      },
    })
    return await axiosInstance.get(`${API_URL}?${query}`)
  },

  AddCatSheet: async (catSheet: CatSheetPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: catSheet })
  },
  UpdateCatSheet: async (id: string, catSheet: CatSheetPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: catSheet })
  },
  SetCatSheetArchived: async (documentId: string, isArchived: boolean) => {
    return await axiosInstance.put(`${API_URL}/${documentId}`, {
      data: { isArchived },
    })
  },
}
