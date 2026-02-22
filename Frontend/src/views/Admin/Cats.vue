<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import CatSheetModal from '@/components/Modals/CatSheetModal.vue'

const loading = ref<boolean>(false)
const editModalVisible = ref<boolean>(false)

const closeModal = (visible: boolean) => {
  editModalVisible.value = visible
}
</script>

<template>
  <CatSheetModal :visible="editModalVisible" @update:visible="closeModal($event)" />
</template>
