<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BlogPostService } from '@/services/blogPostService'
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'

const route = useRoute()
const router = useRouter()

const blogPost = ref<BlogPost | null>(null)
const loading = ref(true)
const notFound = ref(false)

const getMediaUrl = (url: string) => {
  const baseUrl = (import.meta.env.VITE_APP_API_BASE_URL as string)?.replace(/\/api\/?$/, '') || ''
  return url.startsWith('http') ? url : `${baseUrl}${url}`
}

const formatDate = (value: string) => {
  return new Intl.DateTimeFormat('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

onMounted(async () => {
  try {
    const response = await BlogPostService.GetPublicBlogPost(route.params.identifier as string)
    blogPost.value = response.data.data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
})
const placeholderLabel = (title: string) => {
  const first = title.trim().charAt(0).toUpperCase()
  return first || 'B'
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <div v-if="loading" class="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-12">
      <Skeleton height="18rem" class="rounded-3xl" />
      <Skeleton height="3rem" />
      <Skeleton height="10rem" />
    </div>

    <div v-else-if="notFound || !blogPost" class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-5 px-4 text-center">
      <i class="pi pi-exclamation-circle text-5xl text-surface-300"></i>
      <h1 class="text-3xl font-bold text-surface-800">{{ $t('blog.not-found') }}</h1>
      <p class="text-surface-500">{{ $t('blog.not-found-subtitle') }}</p>
      <Button
        :label="$t('blog.back-to-list')"
        icon="pi pi-arrow-left"
        outlined
        @click="router.push({ name: RouteNames.BLOG })"
      />
    </div>

    <article v-else class="mx-auto flex max-w-4xl flex-col gap-8 px-4 py-10">
      <Button
        :label="$t('blog.back-to-list')"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        class="self-start"
        @click="router.push({ name: RouteNames.BLOG })"
      />

      <img
        v-if="blogPost.cover"
        :src="getMediaUrl(blogPost.cover.url)"
        :alt="blogPost.title"
        class="h-[22rem] w-full rounded-3xl object-cover shadow-sm"
      />
      <div
        v-else
        class="flex h-[22rem] w-full items-center justify-center rounded-3xl bg-gradient-to-br from-primary-100 via-white to-primary-50 shadow-sm"
      >
        <div class="flex h-24 w-24 items-center justify-center rounded-full bg-white text-4xl font-bold text-primary-500 shadow-sm">
          {{ placeholderLabel(blogPost.title) }}
        </div>
      </div>

      <div class="space-y-5 rounded-3xl bg-white p-8 shadow-sm">
        <div class="flex flex-wrap items-center gap-3 text-sm text-surface-400">
          <Tag :value="blogPost.isPublished ? $t('blog.published') : $t('blog.draft')" />
          <span>{{ formatDate(blogPost.createdAt) }}</span>
          <span>{{ blogPost.author?.username || $t('blog.unknown-author') }}</span>
        </div>

        <h1 class="text-4xl font-bold text-surface-800">{{ blogPost.title }}</h1>

        <p v-if="blogPost.excerpt" class="text-lg leading-8 text-surface-500">
          {{ blogPost.excerpt }}
        </p>

        <div class="whitespace-pre-line text-base leading-8 text-surface-700">
          {{ blogPost.content }}
        </div>
      </div>
    </article>
  </div>
</template>
