<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CatSheetModal from '@/components/Modals/CatSheetModal.vue'
import { useCatStore } from '@/stores/cats'

const catStore = useCatStore()
const loading = ref<boolean>(false)
const editModalVisible = ref<boolean>(false)

onMounted(() => {
  loadData()
})

const loadData = async () => {
  try {
    loading.value = true
    await catStore.fectchCats()
  } catch (error) {
    console.error('Error fetching cats:', error)
  } finally {
    loading.value = false
  }
}

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
}
</script>

<template>
  <CatSheetModal
    :cat="null"
    :visible="editModalVisible"
    @update:visible="closeModal($event)"
    @update:datas="loadData"
  />

  <Button
    class="mb-3"
    :label="$t('admin.cat.cat-create')"
    icon="pi pi-plus"
    iconPos="right"
    @click="editModalVisible = true"
  />
</template>
