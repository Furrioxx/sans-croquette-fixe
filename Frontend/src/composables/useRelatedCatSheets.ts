import type { CatSheet } from '@/models/CatSheet'
import { CatSheetService } from '@/services/catSheetService'
import { onMounted, ref } from 'vue'

export const useRelatedCatSheets = (excludeDocumentId: string, pageSize = 3) => {
  const relatedCats = ref<CatSheet[]>([])

  onMounted(async () => {
    try {
      const response = await CatSheetService.GetPublicCatSheets({
        page: 1,
        pageSize,
        excludeIds: [excludeDocumentId],
      })
      relatedCats.value = response.data.data
    } catch (e) {
      console.error(e)
    }
  })

  return { relatedCats }
}
