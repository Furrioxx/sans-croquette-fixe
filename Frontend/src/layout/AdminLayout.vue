<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AdminAppNavBar from '@/components/AdminAppNavBar.vue'

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
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
  <div class="flex min-h-screen w-full">
    <Toast position="bottom-right" :style="{ width: toastWidth }" />
    <ConfirmDialog></ConfirmDialog>
    <div class="flex-1">
      <AdminAppNavBar />
      <!-- RouterView is in AdminAppNavBar.vue -->
    </div>
  </div>
</template>
