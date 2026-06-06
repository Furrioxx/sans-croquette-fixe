<script setup lang="ts">
import type { CatSheet } from '@/models/CatSheet'
import type { StrapiMedia } from '@/models/Cat'
import { computed, ref, watch } from 'vue'

const props = defineProps<{
  catSheet: CatSheet | null
  visible: boolean
}>()

const emit = defineEmits(['update:visible'])

const activeIndex = ref(0)

watch(() => props.catSheet, () => { activeIndex.value = 0 })

const catNames = computed(() => {
  if (!props.catSheet) return ''
  return props.catSheet.cats.map((c) => c.name).join(' & ')
})

const images = computed<StrapiMedia[]>(() => props.catSheet?.images ?? [])

const getImageUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const close = () => emit('update:visible', false)
</script>

<template>
  <Dialog
    v-model:visible="props.visible"
    modal
    @update:visible="close"
    :style="{ width: '52rem', maxWidth: '95vw' }"
  >
    <template #header>
      <div class="flex items-center gap-2">
        <i class="pi pi-images text-indigo-500 text-lg"></i>
        <span class="font-bold text-lg">{{ catNames }}</span>
        <span class="text-surface-400 text-sm font-normal">
          — {{ images.length }} {{ $t('admin.cat.gallery-photo-count') }}
        </span>
      </div>
    </template>

    <div v-if="images.length === 0" class="flex flex-col items-center justify-center gap-3 py-16 text-surface-400">
      <i class="pi pi-image text-5xl"></i>
      <span class="text-base">{{ $t('admin.cat.gallery-empty') }}</span>
    </div>

    <div v-else class="gallery-wrapper rounded-lg overflow-hidden">
      <Galleria
        v-model:activeIndex="activeIndex"
        :value="images"
        :numVisible="5"
        :circular="true"
        :showItemNavigators="images.length > 1"
        :showThumbnails="images.length > 1"
        class="w-full"
      >
        <template #item="{ item }">
          <div class="flex items-center justify-center bg-surface-900 dark:bg-surface-950" style="min-height: 22rem;">
            <img
              :src="getImageUrl(item.url)"
              :alt="item.name"
              class="max-h-[26rem] max-w-full object-contain select-none"
            />
          </div>
        </template>

        <template #thumbnail="{ item }">
          <img
            :src="getImageUrl(item.url)"
            :alt="item.name"
            class="w-16 h-12 object-cover rounded"
          />
        </template>
      </Galleria>
    </div>

    <template #footer>
      <Button :label="$t('cancel')" text severity="secondary" @click="close" />
    </template>
  </Dialog>
</template>

<style scoped>
.gallery-wrapper :deep(.p-galleria-nav-button) {
  color: white;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 50%;
}
.gallery-wrapper :deep(.p-galleria-nav-button:hover) {
  background: rgba(0, 0, 0, 0.7);
}
</style>
