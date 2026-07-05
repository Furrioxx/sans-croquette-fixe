<script setup lang="ts">
import CatSheetCard from '@/components/CatSheetCard.vue'
import { RouteNames } from '@/router/routeNames'
import { useTinderStore } from '@/stores/tinder'
import { onMounted, ref } from 'vue'

const tinderStore = useTinderStore()
const loading = ref(true)

onMounted(async () => {
  await tinderStore.hydrate()
  loading.value = false
})
</script>

<template>
  <div class="min-h-screen bg-surface-50 dark:bg-surface-900">
    <div class="bg-gradient-to-b from-primary-50 to-surface-50 dark:from-primary-950/20 dark:to-surface-900 pt-12 pb-8 px-4 text-center">
      <h1 class="text-4xl sm:text-5xl font-bold text-surface-800 dark:text-surface-50 tracking-tight">
        {{ $t('discover.my-likes-title') }}
      </h1>
      <p class="mt-3 text-lg text-surface-500 dark:text-surface-400">
        {{ $t('discover.my-likes-subtitle') }}
      </p>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="flex items-center justify-between py-5">
        <Button
          as="router-link"
          :to="{ name: RouteNames.DISCOVER }"
          :label="$t('discover.back-to-discover')"
          icon="pi pi-arrow-left"
          severity="secondary"
          outlined
          size="small"
        />
      </div>

      <div v-if="loading" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="i in 3"
          :key="i"
          class="bg-white dark:bg-surface-800 rounded-2xl overflow-hidden border border-surface-100 dark:border-surface-700 animate-pulse"
        >
          <div class="aspect-[4/3] bg-surface-200 dark:bg-surface-700"></div>
          <div class="p-5 space-y-3">
            <div class="h-5 bg-surface-200 dark:bg-surface-700 rounded w-1/2"></div>
            <div class="h-4 bg-surface-100 dark:bg-surface-600 rounded w-1/3"></div>
          </div>
        </div>
      </div>

      <div
        v-else-if="tinderStore.likedCatSheets.length === 0"
        class="flex flex-col items-center justify-center py-24 gap-4 text-center"
      >
        <div class="w-20 h-20 rounded-full bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
          <i class="pi pi-heart text-3xl text-primary-300 dark:text-primary-600"></i>
        </div>
        <h3 class="text-xl font-semibold text-surface-700 dark:text-surface-300">
          {{ $t('discover.no-likes') }}
        </h3>
        <p class="text-surface-400 dark:text-surface-500 text-sm">{{ $t('discover.no-likes-sub') }}</p>
        <Button
          as="router-link"
          :to="{ name: RouteNames.DISCOVER }"
          :label="$t('discover.nav-link')"
          severity="secondary"
          outlined
          size="small"
        />
      </div>

      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="catSheet in tinderStore.likedCatSheets" :key="catSheet.documentId" class="relative">
          <CatSheetCard :catSheet="catSheet" />
          <button
            :aria-label="$t('discover.unlike')"
            class="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 dark:bg-surface-900/90 shadow-sm flex items-center justify-center text-red-500 hover:scale-105 transition-transform"
            @click="tinderStore.unlikeCatSheet(catSheet.documentId)"
          >
            <i class="pi pi-trash text-sm"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
