<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BlogPostService } from '@/services/blogPostService'
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'
import { SeoUtils } from '@/utils/seoUtils'
import {
  formatBlogDate,
  getBlogAuthorLabel,
  getBlogMediaUrl,
  getBlogPlaceholderLabel,
} from '@/utils/blogUtils'

const route = useRoute()
const router = useRouter()

const blogPost = ref<BlogPost | null>(null)
const recentPosts = ref<BlogPost[]>([])
const loading = ref(true)
const notFound = ref(false)
const articleIdentifier = computed(() => route.params.identifier as string)

const readingTime = computed(() => {
  if (!blogPost.value?.content) return 1
  const words = blogPost.value.content.trim().split(/\s+/).length
  return Math.max(1, Math.ceil(words / 180))
})

const shareArticle = async () => {
  const currentUrl = window.location.href

  if (navigator.share && blogPost.value) {
    await navigator.share({
      title: blogPost.value.title,
      url: currentUrl,
    })
    return
  }

  await navigator.clipboard.writeText(currentUrl)
}

const loadArticle = async () => {
  loading.value = true
  notFound.value = false
  blogPost.value = null
  recentPosts.value = []

  try {
    const response = await BlogPostService.GetPublicBlogPost(articleIdentifier.value)
    if (!response.data.data) {
      notFound.value = true
      return
    }

    blogPost.value = response.data.data

    const coverUrl = response.data.data.cover?.url
      ? getBlogMediaUrl(response.data.data.cover.url)
      : null

    SeoUtils.applyPageSeo({
      title: response.data.data.seoTitle || response.data.data.title,
      description:
        response.data.data.seoDescription ||
        response.data.data.excerpt ||
        response.data.data.content.slice(0, 160),
      image: coverUrl,
      canonicalPath: `/blog/${response.data.data.slug || response.data.data.documentId}`,
    })

    const recentResponse = await BlogPostService.GetPublicBlogPosts({
      page: 1,
      pageSize: 3,
      category: response.data.data.category?.slug || undefined,
    })

    recentPosts.value = recentResponse.data.data.filter(
      (item: BlogPost) => item.documentId !== response.data.data.documentId,
    )
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

watch(articleIdentifier, () => {
  loadArticle()
}, { immediate: true })
</script>

<template>
  <main class="blog-shell min-h-screen">
    <div v-if="loading" class="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-12 sm:px-6">
      <Skeleton height="25rem" class="rounded-[2rem]" />
      <Skeleton height="3rem" />
      <Skeleton height="14rem" />
    </div>

    <div
      v-else-if="notFound || !blogPost"
      class="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center gap-5 px-4 text-center"
    >
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

    <article v-else class="mx-auto flex max-w-6xl flex-col gap-10 px-4 py-8 sm:px-6 lg:px-8">
      <Button
        :label="$t('blog.back-to-list')"
        icon="pi pi-arrow-left"
        severity="secondary"
        text
        class="self-start"
        @click="router.push({ name: RouteNames.BLOG })"
      />

      <section class="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem] lg:items-start">
        <div class="space-y-8">
          <div class="space-y-5">
            <div class="blog-meta-row">
              <span class="blog-chip">{{ blogPost.category?.name || 'Actualité' }}</span>
              <span>{{ formatBlogDate(blogPost.publishedAt || blogPost.createdAt) }}</span>
              <span>{{ readingTime }} min de lecture</span>
            </div>

            <h1 class="blog-display text-balance text-4xl sm:text-5xl lg:text-6xl">
              {{ blogPost.title }}
            </h1>

            <p v-if="blogPost.excerpt" class="blog-detail-lead">
              {{ blogPost.excerpt }}
            </p>
          </div>

          <div class="blog-detail-cover">
            <img
              v-if="blogPost.cover"
              :src="getBlogMediaUrl(blogPost.cover.url)"
              :alt="blogPost.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="blog-placeholder h-full min-h-[24rem] text-primary-400"
            >
              <div class="blog-placeholder__badge">
                {{ getBlogPlaceholderLabel(blogPost.title) }}
              </div>
            </div>
          </div>

          <div class="blog-detail-body">
            <div class="blog-detail-prose whitespace-pre-wrap break-words">
              {{ blogPost.content }}
            </div>
          </div>
        </div>

        <aside class="space-y-5 lg:sticky lg:top-8">
          <div class="blog-aside-card">
            <p class="blog-eyebrow">rédaction</p>
            <h2 class="text-xl font-semibold text-surface-800">{{ getBlogAuthorLabel(blogPost) }}</h2>
            <p class="text-sm leading-6 text-surface-500">
              Des nouvelles du refuge, des chats accueillis et des actions menées chaque semaine par l’association.
            </p>
          </div>

          <div class="blog-aside-card">
            <p class="blog-eyebrow">partager</p>
            <div class="flex flex-wrap gap-2">
              <Button
                :label="$t('share')"
                icon="pi pi-share-alt"
                severity="secondary"
                outlined
                @click="shareArticle"
              />
            </div>
          </div>
        </aside>
      </section>

      <section v-if="recentPosts.length" class="space-y-5 pt-4">
        <div>
          <p class="blog-eyebrow">continuer la lecture</p>
          <h2 class="blog-section-title">Autres nouvelles du refuge</h2>
        </div>

        <div class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <article
            v-for="post in recentPosts"
            :key="post.documentId"
            class="blog-grid-card"
          >
            <img
              v-if="post.cover"
              :src="getBlogMediaUrl(post.cover.url)"
              :alt="post.title"
              class="h-48 w-full object-cover"
            />
            <div
              v-else
              class="blog-placeholder h-48 text-primary-400"
            >
              <div class="blog-placeholder__badge">
                {{ getBlogPlaceholderLabel(post.title) }}
              </div>
            </div>

            <div class="blog-grid-card__body">
              <div class="blog-meta-row">
                <span class="blog-chip">{{ post.category?.name || 'Actualité' }}</span>
                <span>{{ formatBlogDate(post.publishedAt || post.createdAt) }}</span>
              </div>
              <h3 class="blog-grid-card__title text-balance">{{ post.title }}</h3>
              <p class="blog-grid-card__excerpt">
                {{ post.excerpt || post.content }}
              </p>
              <div class="mt-auto flex items-center justify-between gap-4 pt-3">
                <span class="blog-author-name text-sm">{{ getBlogAuthorLabel(post) }}</span>
                <Button
                  as="router-link"
                  :to="{ name: RouteNames.BLOG_DETAIL, params: { identifier: post.slug } }"
                  :label="$t('blog.read-more')"
                  text
                  icon="pi pi-arrow-right"
                  iconPos="right"
                />
              </div>
            </div>
          </article>
        </div>
      </section>
    </article>
  </main>
</template>
