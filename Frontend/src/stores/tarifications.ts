import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Tarification, TarificationPostPut } from '@/models/Tarification'
import { TarificationService } from '@/services/tarificationService'

export const useTarificationStore = defineStore('tarifications', () => {
  const tarifications = ref<Tarification[]>([])
  const loading = ref(false)

  const fetchTarifications = async () => {
    try {
      loading.value = true
      const response = await TarificationService.GetAllTarifications()
      tarifications.value = response.data.data
    } finally {
      loading.value = false
    }
  }

  const createTarification = async (payload: TarificationPostPut) => {
    await TarificationService.AddTarification(payload)
    await fetchTarifications()
  }

  const updateTarification = async (documentId: string, payload: TarificationPostPut) => {
    await TarificationService.UpdateTarification(documentId, payload)
    await fetchTarifications()
  }

  return {
    tarifications,
    loading,
    fetchTarifications,
    createTarification,
    updateTarification,
  }
})
