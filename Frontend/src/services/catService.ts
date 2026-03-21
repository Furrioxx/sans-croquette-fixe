import type { CatPostPut } from '@/models/Cat'
import { axiosInstance } from './axiosInsance'

const API_URL = '/cats'

export const CatService = {
  GetAllCats: async () => {
    return await axiosInstance.get(`${API_URL}`)
  },
  AddCat: async (cat: CatPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: cat })
  },
  UpdateCat: async (id: number, cat: CatPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: cat })
  },
}
