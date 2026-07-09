<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import AppNavBar from '@/components/AppNavBar.vue'
import AppFooter from '@/components/AppFooter.vue'

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
    <AppNavBar />
    <ConfirmDialog></ConfirmDialog>
    <div class="h-fit flex flex-col flex-1">
      <RouterView />
    </div>
    <AppFooter />
  </div>
</template>
