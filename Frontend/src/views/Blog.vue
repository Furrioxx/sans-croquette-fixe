<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BlogPostService } from '@/services/blogPostService'
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'

const PAGE_SIZE = 6

const blogPosts = ref<BlogPost[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const search = ref('')

const activeSearch = computed(() => search.value.trim())
const getPostIdentifier = (post: BlogPost) => post.slug || post.documentId

const getPlaceholderLabel = (title: string) => {
  const first = title.trim().charAt(0).toUpperCase()
  return first || 'B'
}

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

const fetchBlogPosts = async () => {
  try {
    loading.value = true
    const response = await BlogPostService.GetPublicBlogPosts({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: activeSearch.value || undefined,
    })

    blogPosts.value = response.data.results
    totalRecords.value = response.data.total
  } catch (error) {
    console.error('Error fetching blog posts', error)
  } finally {
    loading.value = false
  }
}

watch(activeSearch, () => {
  currentPage.value = 1
  fetchBlogPosts()
})

watch(currentPage, fetchBlogPosts)

onMounted(fetchBlogPosts)

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="min-h-screen bg-surface-50">
    <section class="bg-gradient-to-b from-primary-50 to-surface-50 px-4 py-14 text-center">
      <p class="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary-600">
        {{ $t('blog.kicker') }}
      </p>
      <h1 class="text-4xl font-bold text-surface-800 sm:text-5xl">
        {{ $t('blog.title') }}
      </h1>
      <p class="mx-auto mt-4 max-w-2xl text-surface-500">
        {{ $t('blog.subtitle') }}
      </p>
    </section>

    <section class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-10">
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div class="text-sm text-surface-500">
          {{ $t('blog.results', { n: totalRecords }) }}
        </div>

        <div class="w-full md:w-80">
          <SearchInputTextComponent
            :placeholder="$t('blog.search')"
            :value="search"
            @update:value="search = $event"
          />
        </div>
      </div>

      <div v-if="loading" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton v-for="n in PAGE_SIZE" :key="n" height="22rem" class="rounded-2xl" />
      </div>

      <div v-else-if="blogPosts.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="post in blogPosts"
          :key="post.documentId"
          class="overflow-hidden rounded-3xl border border-surface-200 bg-white shadow-sm transition-transform duration-200 hover:-translate-y-1"
        >
          <img
            v-if="post.cover"
            :src="getMediaUrl(post.cover.url)"
            :alt="post.title"
            class="h-52 w-full object-cover"
          />
          <div
            v-else
            class="flex h-52 items-center justify-center bg-gradient-to-br from-primary-100 via-white to-primary-50 text-primary-400"
          >
            <div class="flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl font-bold shadow-sm">
              {{ getPlaceholderLabel(post.title) }}
            </div>
          </div>

          <div class="flex flex-col gap-4 p-6">
            <div class="flex items-center justify-between gap-4 text-xs uppercase tracking-wide text-surface-400">
              <span>{{ formatDate(post.createdAt) }}</span>
              <Tag :value="$t('blog.published')" severity="success" />
            </div>

            <div class="space-y-3">
              <h2 class="text-2xl font-semibold text-surface-800">
                {{ post.title }}
              </h2>
              <p class="line-clamp-4 text-sm leading-6 text-surface-500">
                {{ post.excerpt || post.content }}
              </p>
            </div>

            <div class="flex items-center justify-between pt-2">
              <span class="text-sm text-surface-400">
                {{ post.author?.username || $t('blog.unknown-author') }}
              </span>
              <Button
                as="router-link"
                :to="{ name: RouteNames.BLOG_DETAIL, params: { identifier: getPostIdentifier(post) } }"
                :label="$t('blog.read-more')"
                icon="pi pi-arrow-right"
                iconPos="right"
                text
              />
            </div>
          </div>
        </article>
      </div>

      <div v-else class="rounded-3xl border border-dashed border-surface-300 bg-white p-12 text-center">
        <h2 class="text-xl font-semibold text-surface-700">{{ $t('blog.empty') }}</h2>
        <p class="mt-2 text-surface-500">{{ $t('blog.empty-subtitle') }}</p>
      </div>

      <Paginator
        v-if="totalRecords > PAGE_SIZE"
        :rows="PAGE_SIZE"
        :totalRecords="totalRecords"
        :first="(currentPage - 1) * PAGE_SIZE"
        @page="onPageChange"
      />
    </section>
  </div>
</template>
