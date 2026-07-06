import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Absence, AbsenceCreatePayload, AbsenceStatus } from '@/models/Absence'
import { AbsenceService } from '@/services/absenceService'

export const useAbsenceStore = defineStore('absences', () => {
  const absences = ref<Absence[]>([])
  const loading = ref(false)

  const fetchAbsences = async () => {
    try {
      loading.value = true
      const res = await AbsenceService.getAbsences()
      absences.value = res.data.data
    } finally {
      loading.value = false
    }
  }

  const createAbsence = async (payload: AbsenceCreatePayload) => {
    await AbsenceService.createAbsence(payload)
    await fetchAbsences()
  }

  const updateAbsenceStatus = async (documentId: string, status: AbsenceStatus) => {
    await AbsenceService.updateAbsenceStatus(documentId, status)
    await fetchAbsences()
  }

  const updateAbsence = async (documentId: string, payload: AbsenceCreatePayload) => {
    await AbsenceService.updateAbsence(documentId, payload)
    await fetchAbsences()
  }

  const deleteAbsence = async (documentId: string) => {
    await AbsenceService.deleteAbsence(documentId)
    await fetchAbsences()
  }

  const getStatusSeverity = (status: AbsenceStatus) => {
    switch (status) {
      case 'approved':
        return 'success'
      case 'rejected':
        return 'danger'
      case 'pending':
      default:
        return 'warn'
    }
  }

  return {
    absences,
    loading,
    fetchAbsences,
    createAbsence,
    updateAbsenceStatus,
    updateAbsence,
    deleteAbsence,
    getStatusSeverity,
  }
})
