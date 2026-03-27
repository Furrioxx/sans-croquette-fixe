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

  const updateAbsenceStatus = async (id: number, status: AbsenceStatus) => {
    await AbsenceService.updateAbsenceStatus(id, status)
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
    getStatusSeverity,
  }
})

