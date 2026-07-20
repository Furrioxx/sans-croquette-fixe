<script setup lang="ts">
import type { StrapiMedia } from '@/models/Cat'
import { getCatImageUrl } from '@/utils/catImageUrl'
import { ref, computed } from 'vue'

const props = defineProps<{
  initialImages: StrapiMedia[]
}>()

const keptExistingImageIds = ref<number[]>(props.initialImages.map((i) => i.id))
const pendingImages = ref<File[]>([])
const demoPreviewUrl = ref<string | null>(null)

const existingImages = computed(() =>
  props.initialImages.filter((img) => keptExistingImageIds.value.includes(img.id)),
)

const getImageUrl = getCatImageUrl

const removeExistingImage = (imageId: number) => {
  keptExistingImageIds.value = keptExistingImageIds.value.filter((id) => id !== imageId)
}

const onImagesSelect = (event: any) => {
  pendingImages.value = event.files
  demoPreviewUrl.value = null
}

const onImagesRemove = (event: any) => {
  pendingImages.value = event.files
}

const onImagesClear = () => {
  pendingImages.value = []
  demoPreviewUrl.value = null
}

const reset = (images: StrapiMedia[]) => {
  keptExistingImageIds.value = images.map((i) => i.id)
  pendingImages.value = []
  demoPreviewUrl.value = null
}

const addDemoImage = (file: File) => {
  pendingImages.value = [file]
  demoPreviewUrl.value = URL.createObjectURL(file)
}

const getState = () => ({
  keptIds: keptExistingImageIds.value,
  pendingFiles: pendingImages.value,
})

defineExpose({ getState, reset, addDemoImage })
</script>

<template>
  <span class="text-surface-500 dark:text-surface-400 block mb-4">
    {{ $t('admin.cat.images-helper') }}
  </span>

  <div v-if="existingImages.length > 0" class="mb-4">
    <p class="font-semibold mb-2">{{ $t('admin.cat.existing-images') }}</p>
    <div class="flex flex-wrap gap-3">
      <div v-for="image in existingImages" :key="image.id" class="relative">
        <img
          :src="getImageUrl(image.url)"
          :alt="image.name"
          class="w-24 h-24 object-cover rounded"
        />
        <Button
          icon="pi pi-times"
          rounded
          text
          severity="danger"
          size="small"
          class="absolute -top-2 -right-2"
          @click="removeExistingImage(image.id)"
        />
      </div>
    </div>
  </div>

  <div v-if="demoPreviewUrl" class="mb-4">
    <p class="font-semibold mb-2">Image de démonstration prête à être ajoutée</p>
    <img
      :src="demoPreviewUrl"
      alt="Aperçu de l’image de démonstration"
      class="h-40 w-full rounded-xl border border-surface-200 object-cover"
    />
  </div>

  <FileUpload
    :multiple="true"
    accept="image/*"
    customUpload
    @select="onImagesSelect"
    @remove="onImagesRemove"
    @clear="onImagesClear"
    @uploader="() => {}"
    :showUploadButton="false"
  />
</template>
