import type { CatSheet, CatSheetPostPut } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import { CatService } from '@/services/catService'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCatSheetStore = defineStore('catSheet', () => {
  const catSheets = ref<CatSheet[]>([])
  const selectedCatSheet = ref<CatSheet | null>(null)

  const fetchCatSheets = async () => {
    try {
      const response = await CatSheetService.GetAllCatSheets()
      catSheets.value = response.data.data
    } catch (error) {
      throw error
    }
  }

  const addCatSheet = async (catSheet: CatSheetPostPut) => {
    try {
      await CatSheetService.AddCatSheet(catSheet)
    } catch (error) {
      throw error
    }
  }

  const updateCatSheet = async (id: string, catSheet: CatSheetPostPut) => {
    try {
      await CatSheetService.UpdateCatSheet(id, catSheet)
    } catch (error) {
      throw error
    }
  }

  const setCatSheetArchived = async (documentId: string, isArchived: boolean) => {
    await CatSheetService.SetCatSheetArchived(documentId, isArchived)
    const catSheet = catSheets.value.find((item) => item.documentId === documentId)
    if (catSheet) catSheet.isArchived = isArchived
    if (selectedCatSheet.value?.documentId === documentId) {
      selectedCatSheet.value.isArchived = isArchived
    }
  }

  const uploadImages = async (formData: FormData): Promise<number[]> => {
    try {
      const response = await CatService.UploadImages(formData)
      return response.data.map((file: any) => file.id)
    } catch (error) {
      throw error
    }
  }

  return {
    catSheets,
    selectedCatSheet,
    fetchCatSheets,
    addCatSheet,
    updateCatSheet,
    setCatSheetArchived,
    uploadImages,
  }
})
