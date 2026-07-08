import { axiosInstance } from './axiosInsance'
import type { Tarification, TarificationPostPut } from '@/models/Tarification'

const API_URL = '/tarifications'

export const TarificationService = {
  GetAllTarifications: async () => {
    return await axiosInstance.get<{ data: Tarification[] }>(`${API_URL}`)
  },

  AddTarification: async (tarification: TarificationPostPut) => {
    return await axiosInstance.post<{ data: Tarification }>(`${API_URL}`, { data: tarification })
  },

  UpdateTarification: async (documentId: string, tarification: TarificationPostPut) => {
    return await axiosInstance.put<{ data: Tarification }>(`${API_URL}/${documentId}`, {
      data: tarification,
    })
  },
}
