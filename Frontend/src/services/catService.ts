import type { CatPostPut } from '@/models/Cat'
import { axiosInstance } from './axiosInsance'
import { toStrapiQueryString } from '@/utils/strapiQuery'

const API_URL = '/cats'

export const CatService = {
  GetAllCats: async () => {
    const query = toStrapiQueryString({ populate: '*' })
    return await axiosInstance.get(`${API_URL}?${query}`)
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
