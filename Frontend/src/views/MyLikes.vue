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
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-6 pb-10 pt-14 text-center md:px-[60px] md:pb-14"
    >
      <div
        class="pointer-events-none absolute left-1/2 -top-32 h-[300px] w-[300px] -translate-x-1/2 rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="relative mx-auto max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('discover.nav-link') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ $t('discover.my-likes-title') }}
        </h1>
        <p class="mx-auto max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('discover.my-likes-subtitle') }}
        </p>
      </div>
    </section>

    <!-- GRID -->
    <section class="w-full bg-[var(--scf-bg)] px-6 pb-16 md:px-[60px]">
      <div class="page-shell">
        <div class="py-6">
          <Button
            as="router-link"
            :to="{ name: RouteNames.DISCOVER }"
            :label="$t('discover.back-to-discover')"
            icon="pi pi-arrow-left"
            rounded
            outlined
            severity="secondary"
            size="small"
            class="w-full !border-[var(--scf-line)] !text-[var(--scf-ink)] sm:w-auto"
          />
        </div>

        <div v-if="loading" class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="i in 3"
            :key="i"
            class="animate-pulse overflow-hidden rounded-[22px] bg-white"
          >
            <div class="aspect-[4/3] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-4 w-1/2 rounded bg-[var(--scf-accent-soft)]"></div>
              <div class="h-3 w-1/3 rounded bg-[var(--scf-bg)]"></div>
            </div>
          </div>
        </div>

        <div
          v-else-if="tinderStore.likedCatSheets.length === 0"
          class="flex flex-col items-center justify-center gap-4 rounded-[22px] bg-white px-6 py-24 text-center"
        >
          <div
            class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]"
          >
            <i class="pi pi-heart text-3xl text-[var(--scf-accent-dark)]"></i>
          </div>
          <h3 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
            {{ $t('discover.no-likes') }}
          </h3>
          <p class="text-sm text-[var(--scf-muted)]">{{ $t('discover.no-likes-sub') }}</p>
          <Button
            as="router-link"
            :to="{ name: RouteNames.DISCOVER }"
            :label="$t('discover.nav-link')"
            rounded
            outlined
            severity="secondary"
            size="small"
            class="!border-[var(--scf-line)] !text-[var(--scf-ink)]"
          />
        </div>

        <div v-else class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div
            v-for="catSheet in tinderStore.likedCatSheets"
            :key="catSheet.documentId"
            class="relative"
          >
            <CatSheetCard :catSheet="catSheet" />
            <button
              :aria-label="$t('discover.unlike')"
              class="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--scf-danger)] transition-transform hover:scale-105"
              @click="tinderStore.unlikeCatSheet(catSheet.documentId)"
            >
              <i class="pi pi-trash text-sm"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
