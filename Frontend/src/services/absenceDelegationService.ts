import { axiosInstance } from './axiosInsance'
import type { AbsenceDelegationStatus } from '@/models/Absence'

const API_URL = '/absence-delegations/status'

export const AbsenceDelegationService = {
  async getStatus() {
    return axiosInstance.get<{ data: AbsenceDelegationStatus }>(API_URL)
  },

  async deactivateDelegation(id: number) {
    return axiosInstance.put<{ data: unknown }>(`/absence-delegations/${id}/deactivate`)
  },
}
