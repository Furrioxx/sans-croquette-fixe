<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BlogPost, BlogPostPostPut } from '@/models/BlogPost'
import { useBlogPostStore } from '@/stores/blogPosts'
import notificationService from '@/services/notificationService'
import { useBlogCategoryStore } from '@/stores/blogCategories'

const props = defineProps<{
  visible: boolean
  blogPost: BlogPost | null
}>()

const emit = defineEmits<{
  'update:visible': [value: boolean]
  'update:datas': []
}>()

const blogPostStore = useBlogPostStore()
const blogCategoryStore = useBlogCategoryStore()

const form = ref<BlogPostPostPut>({
  title: '',
  excerpt: null,
  content: '',
  seoTitle: null,
  seoDescription: null,
  isPublished: false,
  isFeatured: false,
  cover: null,
  category: null,
})
const selectedFile = ref<File | null>(null)
const coverPreviewUrl = ref<string | null>(null)
const saving = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const getMediaUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const syncForm = () => {
  form.value = {
    title: props.blogPost?.title ?? '',
    excerpt: props.blogPost?.excerpt ?? null,
    content: props.blogPost?.content ?? '',
    seoTitle: props.blogPost?.seoTitle ?? null,
    seoDescription: props.blogPost?.seoDescription ?? null,
    isPublished: props.blogPost?.isPublished ?? false,
    isFeatured: props.blogPost?.isFeatured ?? false,
    cover: props.blogPost?.cover?.id ?? null,
    category: props.blogPost?.category?.id ?? null,
  }
  selectedFile.value = null
  coverPreviewUrl.value = props.blogPost?.cover?.url ? getMediaUrl(props.blogPost.cover.url) : null
}

watch(() => props.visible, (visible) => {
  if (visible) {
    syncForm()
  }
})

watch(() => props.blogPost, () => {
  if (props.visible) {
    syncForm()
  }
})

const closeModal = () => {
  emit('update:visible', false)
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  selectedFile.value = file
  coverPreviewUrl.value = file ? URL.createObjectURL(file) : props.blogPost?.cover?.url ?? null

  if (!file && props.blogPost?.cover?.url) {
    coverPreviewUrl.value = getMediaUrl(props.blogPost.cover.url)
  }
}

const removeCover = () => {
  selectedFile.value = null
  form.value.cover = null
  coverPreviewUrl.value = null

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const openFileDialog = () => {
  fileInput.value?.click()
}

const submit = async () => {
  if (!form.value.title.trim() || !form.value.content.trim()) {
    notificationService.showError('Erreur', 'Le titre et le contenu sont requis.')
    return
  }

  if (!form.value.category) {
    notificationService.showError('Erreur', 'La catégorie est requise.')
    return
  }

  try {
    saving.value = true

    let coverId = form.value.cover

    if (selectedFile.value) {
      const uploadData = new FormData()
      uploadData.append('files', selectedFile.value)
      coverId = await blogPostStore.uploadCover(uploadData)
    }

    const payload: BlogPostPostPut = {
      ...form.value,
      title: form.value.title.trim(),
      excerpt: form.value.excerpt?.trim() || null,
      content: form.value.content.trim(),
      cover: coverId,
    }

    if (props.blogPost) {
      await blogPostStore.updateBlogPost(props.blogPost.documentId, payload)
      notificationService.showSuccess('Succès', 'Article mis à jour.')
    } else {
      await blogPostStore.addBlogPost(payload)
      notificationService.showSuccess('Succès', 'Article créé.')
    }

    emit('update:datas')
    closeModal()
  } catch (error) {
    console.error('Error while saving blog post', error)
    notificationService.showError('Erreur', 'Impossible de sauvegarder l’article.')
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <Dialog
    :visible="visible"
    modal
    :header="blogPost ? $t('blog.admin.edit') : $t('blog.admin.create')"
    class="w-[95vw] max-w-4xl"
    @update:visible="emit('update:visible', $event)"
  >
    <div class="flex flex-col gap-5">
      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="blog-title" class="font-semibold">{{ $t('blog.fields.title') }}</label>
          <InputText id="blog-title" v-model="form.title" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="blog-category" class="font-semibold">{{ $t('blog.fields.category') }}</label>
          <Select
            id="blog-category"
            v-model="form.category"
            :options="blogCategoryStore.categories"
            optionLabel="name"
            optionValue="id"
            :placeholder="$t('blog.admin.category-placeholder')"
          />
        </div>
      </div>

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex items-center gap-3">
          <ToggleSwitch v-model="form.isPublished" inputId="blog-published" />
          <label for="blog-published" class="font-medium">{{ $t('blog.fields.isPublished') }}</label>
        </div>

        <div class="flex items-center gap-3">
          <ToggleSwitch v-model="form.isFeatured" inputId="blog-featured" />
          <label for="blog-featured" class="font-medium">{{ $t('blog.fields.isFeatured') }}</label>
        </div>
      </div>

      <div class="flex flex-col gap-2">
        <label for="blog-excerpt" class="font-semibold">{{ $t('blog.fields.excerpt') }}</label>
        <Textarea id="blog-excerpt" v-model="form.excerpt" rows="3" autoResize />
      </div>

      <div class="flex flex-col gap-2">
        <label for="blog-content" class="font-semibold">{{ $t('blog.fields.content') }}</label>
        <Textarea id="blog-content" v-model="form.content" rows="14" autoResize />
      </div>

      <Divider />

      <div class="grid gap-4 md:grid-cols-2">
        <div class="flex flex-col gap-2">
          <label for="blog-seo-title" class="font-semibold">{{ $t('blog.fields.seoTitle') }}</label>
          <InputText id="blog-seo-title" v-model="form.seoTitle" />
        </div>

        <div class="flex flex-col gap-2">
          <label for="blog-seo-description" class="font-semibold">{{ $t('blog.fields.seoDescription') }}</label>
          <Textarea id="blog-seo-description" v-model="form.seoDescription" rows="4" autoResize />
        </div>
      </div>

      <div class="flex flex-col gap-3">
        <label class="font-semibold">{{ $t('blog.fields.cover') }}</label>

        <input
          id="blog-cover"
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="onFileChange"
        />

        <div
          class="flex min-h-44 flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-surface-300 bg-surface-50 p-6 text-center"
        >
          <template v-if="coverPreviewUrl">
            <img
              :src="coverPreviewUrl"
              :alt="form.title"
              class="h-48 w-full rounded-xl object-cover border border-surface-200"
            />
          </template>
          <template v-else>
            <div class="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              <i class="pi pi-image text-2xl text-primary-500"></i>
            </div>
            <div class="space-y-1">
              <p class="font-medium text-surface-700">{{ $t('blog.admin.cover-empty') }}</p>
              <p class="text-sm text-surface-500">{{ $t('blog.admin.cover-help') }}</p>
            </div>
          </template>

          <div class="flex flex-wrap justify-center gap-2">
            <Button
              :label="coverPreviewUrl ? $t('blog.admin.change-cover') : $t('blog.admin.add-cover')"
              icon="pi pi-upload"
              severity="secondary"
              outlined
              @click="openFileDialog"
            />
            <Button
              v-if="coverPreviewUrl"
              :label="$t('blog.admin.remove-cover')"
              icon="pi pi-times"
              severity="secondary"
              outlined
              @click="removeCover"
            />
          </div>
        </div>

      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :label="$t('cancel')" severity="secondary" outlined @click="closeModal" />
        <Button :label="$t('save')" :loading="saving" @click="submit" />
      </div>
    </template>
  </Dialog>
</template>
