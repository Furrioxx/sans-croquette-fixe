<script setup lang="ts">
import { ref, watch } from 'vue'
import type { BlogPost, BlogPostFormValues, BlogPostPostPut } from '@/models/BlogPost'
import { useBlogPostStore } from '@/stores/blogPosts'
import notificationService from '@/services/notificationService'
import { useBlogCategoryStore } from '@/stores/blogCategories'
import { useAuthStore } from '@/stores/authentication'
import BlogPostForm from '@/components/Forms/BlogPostForm.vue'
import type { FormError } from '@/models/FormError'
import { StringUtils } from '@/utils/stringUtils'
import { getBlogMediaUrl } from '@/utils/blogUtils'
import { slugify } from '@/utils/slugify'

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
const authStore = useAuthStore()

const form = ref<BlogPostFormValues>({
  title: '',
  slug: '',
  content: '',
  excerpt: null,
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
const errors = ref<FormError[]>([])

const syncForm = () => {
  form.value = {
    title: props.blogPost?.title ?? '',
    slug: props.blogPost?.slug ?? '',
    content: props.blogPost?.content ?? '',
    excerpt: props.blogPost?.excerpt ?? null,
    seoTitle: props.blogPost?.seoTitle ?? null,
    seoDescription: props.blogPost?.seoDescription ?? null,
    isPublished: !!props.blogPost?.publishedAt,
    isFeatured: props.blogPost?.isFeatured ?? false,
    cover: props.blogPost?.cover?.id ?? null,
    category: props.blogPost?.category?.documentId ?? null,
  }
  selectedFile.value = null
  coverPreviewUrl.value = props.blogPost?.cover?.url ? getBlogMediaUrl(props.blogPost.cover.url) : null
  errors.value = []

  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

watch(
  () => props.visible,
  (visible) => {
    if (visible) {
      syncForm()
    }
  },
)

watch(
  () => props.blogPost,
  () => {
    if (props.visible) {
      syncForm()
    }
  },
)

const closeModal = () => {
  emit('update:visible', false)
}

const onFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0] ?? null

  selectedFile.value = file
  coverPreviewUrl.value = file ? URL.createObjectURL(file) : null

  if (!file && props.blogPost?.cover?.url) {
    coverPreviewUrl.value = getBlogMediaUrl(props.blogPost.cover.url)
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

const validate = () => {
  errors.value = []
  errors.value.push(
    StringUtils.checkInputTextValidity('title', form.value.title.trim(), 'Le titre est requis.'),
  )
  errors.value.push(
    StringUtils.checkInputTextValidity('content', form.value.content.trim(), 'Le contenu est requis.'),
  )

  return errors.value.every((error) => error.valid)
}

const submit = async () => {
  if (!validate()) {
    notificationService.showError('Erreur', 'Le formulaire est incomplet.')
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

    const excerpt = form.value.excerpt?.trim() || null
    const content = form.value.content.trim()
    const fallbackExcerpt = excerpt || content.slice(0, 180) || null
    const seoDescription = form.value.seoDescription?.trim() || excerpt || content.slice(0, 160) || null
    const status = form.value.isPublished ? 'published' : 'draft'
    const slug = slugify(form.value.title) || 'article'

    const payload: BlogPostPostPut = {
      title: form.value.title.trim(),
      slug,
      excerpt: fallbackExcerpt,
      content,
      seoTitle: form.value.title.trim(),
      seoDescription,
      isFeatured: form.value.isFeatured,
      cover: coverId,
      category: form.value.category,
      author: props.blogPost?.author?.id ?? authStore.user?.id ?? null,
    }

    if (props.blogPost) {
      await blogPostStore.updateBlogPost(props.blogPost.documentId, payload, status)
      notificationService.showSuccess('Succès', 'Article mis à jour.')
    } else {
      await blogPostStore.addBlogPost(payload, status)
      notificationService.showSuccess('Succès', 'Article créé.')
    }

    emit('update:datas')
    closeModal()
  } catch (error) {
    console.error('Error while saving blog post', error)
    const message =
      (error as any)?.response?.data?.error?.message || 'Impossible de sauvegarder l’article.'
    notificationService.showError('Erreur', message)
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
    <input
      id="blog-cover"
      ref="fileInput"
      type="file"
      accept="image/*"
      class="hidden"
      @change="onFileChange"
    />

    <BlogPostForm
      v-model="form"
      :categories="blogCategoryStore.categories"
      :errors="errors"
      :coverPreviewUrl="coverPreviewUrl"
      @openCoverPicker="openFileDialog"
      @removeCover="removeCover"
    />

    <template #footer>
      <div class="flex justify-end gap-2">
        <Button :label="$t('cancel')" severity="secondary" outlined @click="closeModal" />
        <Button :label="$t('save')" :loading="saving" @click="submit" />
      </div>
    </template>
  </Dialog>
</template>
