<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AdminAppNavBar from '@/components/AdminAppNavBar.vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})
const getToastWidth = computed(() => {
  return window.innerWidth >= 768 ? '400px' : '300px'
})
const toastWidth = ref<string>(getToastWidth.value)

function handleResize() {
  toastWidth.value = getToastWidth.value
}
</script>

<template>
  <div class="w-full min-h-screen flex">
    <Toast position="bottom-right" :style="{ width: toastWidth }" />
    <ConfirmDialog></ConfirmDialog>
    <div class="flex-1">
      <AdminAppNavBar />
    </div>
  </div>
</template>
