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
import BlogPostCard from '@/components/BlogPostCard.vue'

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
  window.scrollTo({ top: 0 })

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

watch(articleIdentifier, loadArticle, { immediate: true })
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- LOADING -->
    <section v-if="loading" class="w-full animate-pulse bg-[var(--scf-bg)] px-6 py-10 md:px-[60px]">
      <div class="page-shell space-y-6">
        <div class="h-4 w-1/3 rounded bg-white"></div>
        <div class="aspect-[16/7] rounded-[26px] bg-[var(--scf-accent-soft)]"></div>
        <div class="mx-auto h-8 w-2/3 rounded bg-white"></div>
      </div>
    </section>

    <!-- NOT FOUND -->
    <section
      v-else-if="notFound || !blogPost"
      class="flex min-h-[60vh] w-full flex-col items-center justify-center gap-5 bg-[var(--scf-bg)] px-4 text-center"
    >
      <div
        class="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]"
      >
        <i class="pi pi-exclamation-circle text-3xl text-[var(--scf-accent-dark)]"></i>
      </div>
      <h1 class="display-font text-2xl font-bold text-[var(--scf-ink)]">
        {{ $t('blog.not-found') }}
      </h1>
      <p class="text-[var(--scf-muted)]">{{ $t('blog.not-found-subtitle') }}</p>
      <Button
        :label="$t('blog.back-to-list')"
        icon="pi pi-arrow-left"
        severity="secondary"
        outlined
        rounded
        @click="router.push({ name: RouteNames.BLOG })"
      />
    </section>

    <template v-else>
      <!-- BREADCRUMB -->
      <div class="w-full bg-[var(--scf-bg)] px-4 pt-6 sm:px-6 md:px-[60px]">
        <nav
          class="page-shell flex flex-wrap items-center gap-1.5 text-xs font-semibold text-[var(--scf-muted)]"
        >
          <router-link :to="{ name: RouteNames.HOME }" class="hover:text-[var(--scf-ink)]">{{
            $t('footer.links.home')
          }}</router-link>
          <span>/</span>
          <router-link :to="{ name: RouteNames.BLOG }" class="hover:text-[var(--scf-ink)]">{{
            $t('blog.nav-link')
          }}</router-link>
          <span>/</span>
          <span class="line-clamp-1 text-[var(--scf-ink)]">{{ blogPost.title }}</span>
        </nav>
      </div>

      <!-- MAIN -->
      <section class="w-full bg-[var(--scf-bg)] px-4 py-8 sm:px-6 md:px-[60px]">
        <div class="page-shell grid items-start gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div class="space-y-6">
            <div
              class="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[var(--scf-muted)]"
            >
              <span
                class="rounded-full bg-[var(--scf-accent-soft)] px-3 py-1 text-[11px] font-bold uppercase text-[var(--scf-accent-dark)]"
              >
                {{ blogPost.category?.name || 'Actualité' }}
              </span>
              <span>{{ formatBlogDate(blogPost.publishedAt || blogPost.createdAt) }}</span>
              <span>{{ $t('blog.readingTime', { n: readingTime }) }}</span>
            </div>

            <h1
              class="display-font text-3xl font-semibold leading-tight text-[var(--scf-ink)] md:text-5xl"
            >
              {{ blogPost.title }}
            </h1>

            <p v-if="blogPost.excerpt" class="text-base leading-8 text-[var(--scf-text)]">
              {{ blogPost.excerpt }}
            </p>

            <div class="aspect-[16/9] overflow-hidden rounded-[26px] bg-white">
              <img
                v-if="blogPost.cover"
                :src="getBlogMediaUrl(blogPost.cover.url)"
                :alt="blogPost.title"
                class="h-full w-full object-cover"
              />
              <div
                v-else
                class="flex h-full w-full items-center justify-center bg-[var(--scf-accent-soft)]"
              >
                <span class="display-font text-6xl font-bold text-[var(--scf-accent-dark)]">
                  {{ getBlogPlaceholderLabel(blogPost.title) }}
                </span>
              </div>
            </div>

            <div
              class="max-w-[70ch] whitespace-pre-wrap break-words text-base leading-8 text-[var(--scf-text)]"
            >
              {{ blogPost.content }}
            </div>
          </div>

          <!-- SIDEBAR -->
          <aside class="space-y-4 lg:sticky lg:top-24">
            <div class="rounded-[22px] bg-white p-5 sm:p-7">
              <span class="eyebrow">{{ $t('blog.detail.authorEyebrow') }}</span>
              <h2 class="display-font mt-3 text-lg font-semibold text-[var(--scf-ink)]">
                {{ getBlogAuthorLabel(blogPost) }}
              </h2>
              <p class="mt-2 text-sm leading-6 text-[var(--scf-text)]">
                {{ $t('blog.detail.authorText') }}
              </p>
            </div>

            <div class="rounded-[22px] bg-white p-5 sm:p-7">
              <span class="eyebrow">{{ $t('blog.detail.shareEyebrow') }}</span>
              <div class="mt-3">
                <Button
                  :label="$t('share')"
                  icon="pi pi-share-alt"
                  severity="secondary"
                  outlined
                  rounded
                  class="w-full sm:w-auto"
                  @click="shareArticle"
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      <!-- RELATED -->
      <section v-if="recentPosts.length" class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
        <div class="page-shell space-y-8">
          <div class="space-y-2">
            <span class="eyebrow">{{ $t('blog.detail.continueReading') }}</span>
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)] md:text-3xl">
              {{ $t('blog.detail.moreNews') }}
            </h2>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <BlogPostCard v-for="post in recentPosts" :key="post.documentId" :post="post" />
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
