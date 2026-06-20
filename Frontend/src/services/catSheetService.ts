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
}

export const CatSheetService = {
  GetAllCatSheets: async () => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        'populate[cats][populate][cat_moods]': '*',
        'populate[linkedVolunteer]': true,
        'populate[backupVolunteer]': true,
        'populate[images]': true,
      },
    })
  },

  GetPublicCatSheets: async (params: PublicCatSheetParams) => {
    const p: Record<string, unknown> = {
      'populate[cats][populate][cat_moods]': '*',
      'populate[images]': true,
      'pagination[page]': params.page,
      'pagination[pageSize]': params.pageSize,
    }

    params.statuses?.forEach((s, i) => { p[`filters[cats][catStatus][$in][${i}]`] = s })
    params.genders?.forEach((g, i) => { p[`filters[cats][gender][$in][${i}]`] = g })

    if (params.isDuo !== undefined) p['filters[isDuo][$eq]'] = params.isDuo
    if (params.catFriendly) p['filters[cats][catFriendly][$eq]'] = 'yes'
    if (params.dogFriendly) p['filters[cats][dogFriendly][$eq]'] = 'yes'
    if (params.childFriendly) p['filters[cats][childFriendly][$eq]'] = 'yes'
    if (params.vaccinated) p['filters[cats][vaccinated][$eq]'] = true
    if (params.sterilized) p['filters[cats][sterilized][$eq]'] = true
    if (params.identified) p['filters[cats][identified][$eq]'] = true
    if (params.decontaminate) p['filters[cats][decontaminate][$eq]'] = true

    return await axiosInstance.get(API_URL, { params: p })
  },

  AddCatSheet: async (catSheet: CatSheetPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: catSheet })
  },
  UpdateCatSheet: async (id: string, catSheet: CatSheetPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: catSheet })
  },
}
