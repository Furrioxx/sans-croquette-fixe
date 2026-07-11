<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import AppNavBar from '@/components/AppNavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

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
  <div class="site-frame flex min-h-screen w-full flex-col">
    <Toast position="bottom-right" :style="{ width: toastWidth }" />
    <AppNavBar />
    <ConfirmDialog></ConfirmDialog>
    <div class="flex h-fit flex-1 flex-col">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>
