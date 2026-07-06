import { axiosInstance } from './axiosInsance'
import type { Absence, AbsenceCreatePayload, AbsenceStatus } from '@/models/Absence'

const API_URL = '/absences'

export const AbsenceService = {
  async getAbsences() {
    return axiosInstance.get<{ data: Absence[] }>(API_URL)
  },

  async createAbsence(payload: AbsenceCreatePayload) {
    return axiosInstance.post<{ data: Absence }>(API_URL, {
      data: {
        ...payload,
      },
    })
  },

  async updateAbsenceStatus(documentId: string, status: AbsenceStatus) {
    return axiosInstance.put<{ data: Absence }>(`${API_URL}/${documentId}`, {
      data: {
        absence_status: status,
      },
    })
  },

  async updateAbsence(documentId: string, payload: AbsenceCreatePayload) {
    return axiosInstance.put<{ data: Absence }>(`${API_URL}/${documentId}`, {
      data: {
        ...payload,
      },
    })
  },

  async deleteAbsence(documentId: string) {
    return axiosInstance.delete<{ data: Absence }>(`${API_URL}/${documentId}`)
  },
}
