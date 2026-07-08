import type { CatSheetPostPut } from '@/models/CatSheet'
import { axiosInstance } from './axiosInsance'

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

export const CatSheetService = {
  GetAllCatSheets: async () => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        'populate[cats][populate][cat_moods]': '*',
        'populate[linkedVolunteer]': true,
        'populate[backupVolunteer]': true,
        'populate[images]': true,
        'populate[tarification]': true,
      },
    })
  },

  GetPublicCatSheets: async (params: PublicCatSheetParams) => {
    const p: Record<string, unknown> = {
      'populate[cats][populate][cat_moods]': '*',
      'populate[images]': true,
      'populate[tarification]': true,
      'pagination[page]': params.page,
      'pagination[pageSize]': params.pageSize,
    }

    const statuses = params.statuses?.length ? params.statuses : ADOPTABLE_STATUSES
    statuses.forEach((s, i) => { p[`filters[cats][catStatus][$in][${i}]`] = s })
    params.genders?.forEach((g, i) => { p[`filters[cats][gender][$in][${i}]`] = g })

    if (params.isDuo !== undefined) p['filters[isDuo][$eq]'] = params.isDuo
    if (params.catFriendly) p['filters[cats][catFriendly][$eq]'] = 'yes'
    if (params.dogFriendly) p['filters[cats][dogFriendly][$eq]'] = 'yes'
    if (params.childFriendly) p['filters[cats][childFriendly][$eq]'] = 'yes'
    if (params.vaccinated) p['filters[cats][vaccinated][$eq]'] = true
    if (params.sterilized) p['filters[cats][sterilized][$eq]'] = true
    if (params.identified) p['filters[cats][identified][$eq]'] = true
    if (params.decontaminate) p['filters[cats][decontaminate][$eq]'] = true
    params.excludeIds?.forEach((id, i) => { p[`filters[documentId][$notIn][${i}]`] = id })

    return await axiosInstance.get(API_URL, { params: p })
  },

  GetPublicCatSheet: async (documentId: string) => {
    return await axiosInstance.get(`${API_URL}/${documentId}`, {
      params: {
        'populate[cats][populate][cat_moods]': '*',
        'populate[images]': true,
        'populate[tarification]': true,
      },
    })
  },

  GetCatSheetsByIds: async (documentIds: string[]) => {
    if (!documentIds.length) return { data: { data: [] } }
    const p: Record<string, unknown> = {
      'populate[cats][populate][cat_moods]': '*',
      'populate[images]': true,
      'populate[tarification]': true,
      'pagination[pageSize]': documentIds.length,
    }
    documentIds.forEach((id, i) => { p[`filters[documentId][$in][${i}]`] = id })
    return await axiosInstance.get(API_URL, { params: p })
  },

  AddCatSheet: async (catSheet: CatSheetPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: catSheet })
  },
  UpdateCatSheet: async (id: string, catSheet: CatSheetPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: catSheet })
  },
}
