<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppNavBar from '@/components/AppNavBar.vue'

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
  <div class="site-frame w-full min-h-screen flex flex-col">
    <Toast position="bottom-right" :style="{ width: toastWidth }" />
    <div class="page-shell w-full pt-4 md:pt-6">
      <AppNavBar />
    </div>
    <ConfirmDialog></ConfirmDialog>
    <div class="h-fit flex flex-col flex-1 mb-10 mt-4 md:mt-6">
      <RouterView />
    </div>
  </div>
</template>
