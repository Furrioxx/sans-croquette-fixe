import type { CatSheetPostPut } from '@/models/CatSheet'
import { axiosInstance } from './axiosInsance'

const API_URL = '/cat-sheets'

export const CatSheetService = {
  GetAllCatSheets: async () => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        populate: '*',
      },
    })
  },
  AddCatSheet: async (catSheet: CatSheetPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: catSheet })
  },
  UpdateCatSheet: async (id: string, catSheet: CatSheetPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: catSheet })
  },
}
