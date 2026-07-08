import { axiosInstance } from './axiosInsance'
import type { AdoptionRequest, AdoptionRequestFormValues } from '@/models/AdoptionRequest'

const API_URL = '/adoption-requests'

export const AdoptionRequestService = {
  async getAdoptionRequests() {
    return axiosInstance.get<{ data: AdoptionRequest[] }>(API_URL)
  },

  async getAdoptionRequest(documentId: string) {
    return axiosInstance.get<{ data: AdoptionRequest }>(`${API_URL}/${documentId}`)
  },

  async createAdoptionRequest(payload: AdoptionRequestFormValues) {
    return axiosInstance.post<{ data: AdoptionRequest }>(API_URL, {
      data: payload,
    })
  },

  async updateAdoptionRequest(documentId: string, payload: AdoptionRequestFormValues) {
    return axiosInstance.put<{ data: AdoptionRequest }>(`${API_URL}/${documentId}`, {
      data: payload,
    })
  },

  async deleteAdoptionRequest(documentId: string) {
    return axiosInstance.delete<{ data: AdoptionRequest }>(`${API_URL}/${documentId}`)
  },
}
