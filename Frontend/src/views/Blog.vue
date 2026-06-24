<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BlogPostService } from '@/services/blogPostService'
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'
import { BlogCategoryService } from '@/services/blogCategoryService'
import type { BlogCategory } from '@/models/BlogCategory'
import { SeoUtils } from '@/utils/seoUtils'

const PAGE_SIZE = 6

const blogPosts = ref<BlogPost[]>([])
const categories = ref<BlogCategory[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const search = ref('')
const category = ref('')

const activeSearch = computed(() => search.value.trim())
const selectedCategoryLabel = computed(() => {
  if (!category.value) return null
  return categories.value.find((item) => item.slug === category.value)?.name ?? null
})

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

const authorLabel = (post: BlogPost) => {
  const username = post.author?.username || 'Sans Croquette Fixe'
  return post.authorRoleLabel ? `${username} · ${post.authorRoleLabel}` : username
}

const fetchBlogPosts = async () => {
  try {
    loading.value = true
    const response = await BlogPostService.GetPublicBlogPosts({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: activeSearch.value || undefined,
      category: category.value || undefined,
    })

    blogPosts.value = response.data.results
    totalRecords.value = response.data.total
  } catch (error) {
    console.error('Error fetching blog posts', error)
  } finally {
    loading.value = false
  }
}

const fetchCategories = async () => {
  const response = await BlogCategoryService.GetPublicCategories()
  categories.value = response.data.data
}

watch([activeSearch, category], () => {
  currentPage.value = 1
  fetchBlogPosts()
})

watch(currentPage, fetchBlogPosts)

onMounted(async () => {
  SeoUtils.applyPageSeo({
    title: 'Blog',
    description: 'Actualites, sauvetages, conseils et vie de l association.',
    canonicalPath: '/blog',
  })

  await Promise.all([fetchBlogPosts(), fetchCategories()])
})

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="blog-shell min-h-screen">
    <section class="px-4 pb-8 pt-10 sm:px-6 lg:px-8">
      <div class="blog-hero__inner mx-auto max-w-7xl">
        <div class="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_24rem] lg:items-end">
          <div class="space-y-5">
            <p class="blog-kicker">
              {{ $t('blog.kicker') }}
            </p>
            <h1 class="blog-display text-balance text-5xl sm:text-6xl lg:text-7xl">
              {{ $t('blog.title') }}
            </h1>
            <p class="blog-hero__copy">
              {{ $t('blog.subtitle') }}
            </p>
          </div>

          <aside class="blog-hero__aside">
            <div class="blog-hero__aside-card">
              <p class="blog-eyebrow">sur le terrain</p>
              <p class="blog-hero__aside-text">
                Histoires de sauvetage, nouvelles des chats recueillis et conseils concrets pour mieux comprendre l’abandon, l’accueil et l’adoption.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>

    <section class="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-16 sm:px-6 lg:px-8">
      <div class="blog-toolbar">
        <div class="flex flex-col gap-2">
          <span class="blog-result-count">{{ $t('blog.results', { n: totalRecords }) }}</span>
          <span v-if="selectedCategoryLabel" class="blog-filter-pill">
            {{ selectedCategoryLabel }}
          </span>
        </div>

        <div class="grid w-full gap-3 md:w-auto md:grid-cols-[20rem_14rem]">
          <SearchInputTextComponent
            :placeholder="$t('blog.search')"
            :value="search"
            @update:value="search = $event"
          />

          <Select
            v-model="category"
            :options="[
              { label: $t('blog.filters.all-categories'), value: '' },
              ...categories.map((item) => ({ label: item.name, value: item.slug })),
            ]"
            optionLabel="label"
            optionValue="value"
          />
        </div>
      </div>

      <div v-if="loading" class="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <Skeleton v-for="n in PAGE_SIZE" :key="n" height="22rem" class="rounded-[2rem]" />
      </div>

      <template v-else-if="blogPosts.length">
        <section class="space-y-6">
          <div>
            <p class="blog-eyebrow">dernières nouvelles</p>
            <h2 class="blog-section-title">Chroniques du refuge</h2>
          </div>

          <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            <article
              v-for="post in blogPosts"
              :key="post.documentId"
              class="blog-list-card"
            >
              <img
                v-if="post.cover"
                :src="getMediaUrl(post.cover.url)"
                :alt="post.title"
                class="h-44 w-full object-cover"
              />
              <div
                v-else
                class="blog-placeholder h-44 text-primary-400"
              >
                <div class="blog-placeholder__badge">
                  {{ getPlaceholderLabel(post.title) }}
                </div>
              </div>

              <div class="blog-list-card__body">
                <div class="blog-meta-row">
                  <span class="blog-chip">{{ post.category?.name || 'Actualité' }}</span>
                  <span>{{ formatDate(post.publishedAt || post.createdAt) }}</span>
                </div>

                <div class="space-y-2">
                  <h3 class="blog-list-card__title text-balance">
                    {{ post.title }}
                  </h3>
                  <p class="blog-list-card__excerpt line-clamp-3">
                    {{ post.excerpt || post.content }}
                  </p>
                </div>

                <div class="mt-auto flex items-end justify-between gap-4 pt-2">
                  <span class="blog-author-name text-sm line-clamp-2">{{ authorLabel(post) }}</span>
                  <Button
                    as="router-link"
                    :to="{ name: RouteNames.BLOG_DETAIL, params: { identifier: getPostIdentifier(post) } }"
                    :label="$t('blog.read-more')"
                    text
                    icon="pi pi-arrow-right"
                    iconPos="right"
                    class="shrink-0"
                  />
                </div>
              </div>
            </article>
          </div>
        </section>
      </template>

      <div
        v-else
        class="blog-empty-state"
      >
        <div class="blog-empty-state__icon">
          <i class="pi pi-heart-fill"></i>
        </div>
        <div class="space-y-2">
          <p class="blog-eyebrow">bientôt ici</p>
          <h2 class="text-2xl font-semibold text-surface-800">{{ $t('blog.empty') }}</h2>
          <p class="mx-auto max-w-xl text-surface-500">{{ $t('blog.empty-subtitle') }}</p>
        </div>
      </div>

      <Paginator
        v-if="totalRecords > PAGE_SIZE"
        :rows="PAGE_SIZE"
        :totalRecords="totalRecords"
        :first="(currentPage - 1) * PAGE_SIZE"
        @page="onPageChange"
      />
    </section>
  </main>
</template>
