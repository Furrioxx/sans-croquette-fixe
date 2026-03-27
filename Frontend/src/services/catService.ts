import type { CatPostPut } from '@/models/Cat'
import { axiosInstance } from './axiosInsance'

const API_URL = '/cats'

export const CatService = {
  GetAllCats: async () => {
    return await axiosInstance.get(`${API_URL}`, {
      params: {
        populate: '*',
      },
    })
  },
  UploadImages: async (formData: FormData) => {
    return await axiosInstance.post('/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
  },
  AddCat: async (cat: CatPostPut) => {
    return await axiosInstance.post(`${API_URL}`, { data: cat })
  },
  UpdateCat: async (id: string, cat: CatPostPut) => {
    return await axiosInstance.put(`${API_URL}/${id}`, { data: cat })
  },
}
