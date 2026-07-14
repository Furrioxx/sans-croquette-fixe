<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { BlogPostService } from '@/services/blogPostService'
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'
import { BlogCategoryService } from '@/services/blogCategoryService'
import type { BlogCategory } from '@/models/BlogCategory'
import { SeoUtils } from '@/utils/seoUtils'
import { formatBlogDate, getBlogMediaUrl, getBlogPlaceholderLabel } from '@/utils/blogUtils'
import BlogPostCard from '@/components/BlogPostCard.vue'

const PAGE_SIZE = 6

const blogPosts = ref<BlogPost[]>([])
const featuredPost = ref<BlogPost | null>(null)
const categories = ref<BlogCategory[]>([])
const loading = ref(false)
const totalRecords = ref(0)
const currentPage = ref(1)
const search = ref('')
const ALL_CATEGORIES = 'all'
const category = ref(ALL_CATEGORIES)

const activeSearch = computed(() => search.value.trim())
const selectedCategoryLabel = computed(() => {
  if (category.value === ALL_CATEGORIES) return null
  return categories.value.find((item) => item.slug === category.value)?.name ?? null
})

const fetchBlogPosts = async () => {
  try {
    loading.value = true
    const response = await BlogPostService.GetPublicBlogPosts({
      page: currentPage.value,
      pageSize: PAGE_SIZE,
      search: activeSearch.value || undefined,
      category: category.value !== ALL_CATEGORIES ? category.value : undefined,
    })

    blogPosts.value = response.data.data
    totalRecords.value = response.data.meta.pagination.total
  } catch (error) {
    console.error('Error fetching blog posts', error)
  } finally {
    loading.value = false
  }
}

const fetchFeaturedPost = async () => {
  try {
    const response = await BlogPostService.GetPublicBlogPosts({
      page: 1,
      pageSize: 1,
      isFeatured: true,
    })
    featuredPost.value = response.data.data[0] ?? null
  } catch (error) {
    console.error('Error fetching featured blog post', error)
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

  await Promise.all([fetchBlogPosts(), fetchFeaturedPost(), fetchCategories()])
})

const onPageChange = (event: { page: number }) => {
  currentPage.value = event.page + 1
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="flex w-full flex-col">
    <!-- HERO -->
    <section
      class="relative w-full overflow-hidden bg-[var(--scf-bg)] px-4 pb-10 pt-14 sm:px-6 md:px-[60px] md:pb-14"
    >
      <div
        class="pointer-events-none absolute -right-20 -top-32 h-[300px] w-[300px] rounded-full bg-[var(--scf-accent-soft)]"
      ></div>
      <div class="page-shell relative max-w-2xl space-y-5">
        <span class="eyebrow">{{ $t('blog.kicker') }}</span>
        <h1 class="display-font text-4xl font-semibold leading-tight md:text-6xl">
          {{ $t('blog.title') }}
        </h1>
        <p class="max-w-xl text-base leading-7 text-[var(--scf-text)] md:text-lg">
          {{ $t('blog.subtitle') }}
        </p>
        <p class="max-w-xl text-sm leading-6 text-[var(--scf-muted)]">
          {{ $t('blog.list.fieldNotesText') }}
        </p>
      </div>
    </section>

    <!-- FEATURED -->
    <section v-if="featuredPost" class="w-full bg-[var(--scf-bg)] px-4 pb-14 sm:px-6 md:px-[60px]">
      <div class="page-shell">
        <router-link
          :to="{ name: RouteNames.BLOG_DETAIL, params: { identifier: featuredPost.slug } }"
          class="grid overflow-hidden rounded-[26px] bg-white md:grid-cols-2"
        >
          <div class="aspect-[16/10] overflow-hidden bg-[var(--scf-bg)] md:aspect-auto">
            <img
              v-if="featuredPost.cover"
              :src="getBlogMediaUrl(featuredPost.cover.url)"
              :alt="featuredPost.title"
              class="h-full w-full object-cover"
            />
            <div
              v-else
              class="flex h-full w-full items-center justify-center bg-[var(--scf-accent-soft)]"
            >
              <span class="display-font text-5xl font-bold text-[var(--scf-accent-dark)]">
                {{ getBlogPlaceholderLabel(featuredPost.title) }}
              </span>
            </div>
          </div>
          <div class="flex flex-col justify-center gap-4 p-8 md:p-10">
            <span class="eyebrow w-fit">{{ $t('blog.eyebrowFeatured') }}</span>
            <div
              class="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[var(--scf-muted)]"
            >
              <span
                class="rounded-full bg-[var(--scf-accent-soft)] px-3 py-1 text-[11px] font-bold uppercase text-[var(--scf-accent-dark)]"
              >
                {{ featuredPost.category?.name || 'Actualité' }}
              </span>
              <span>{{ formatBlogDate(featuredPost.publishedAt || featuredPost.createdAt) }}</span>
            </div>
            <h2 class="display-font text-2xl font-semibold text-[var(--scf-ink)] md:text-3xl">
              {{ featuredPost.title }}
            </h2>
            <p class="line-clamp-3 text-sm leading-7 text-[var(--scf-text)] md:text-base">
              {{ featuredPost.excerpt || featuredPost.content }}
            </p>
            <span
              class="inline-flex w-fit items-center gap-2 text-sm font-semibold text-[var(--scf-accent-dark)]"
            >
              {{ $t('blog.read-more') }}
              <i class="pi pi-arrow-right text-xs"></i>
            </span>
          </div>
        </router-link>
      </div>
    </section>

    <!-- TOOLBAR + GRID -->
    <section class="w-full bg-white px-4 py-16 sm:px-6 md:px-[60px]">
      <div class="page-shell space-y-8">
        <div class="space-y-2">
          <span class="eyebrow">{{ $t('blog.list.latestEyebrow') }}</span>
          <h2 class="display-font text-3xl font-semibold md:text-4xl">
            {{ $t('blog.list.latestTitle') }}
          </h2>
        </div>

        <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex flex-wrap items-center gap-3">
            <span class="text-sm text-[var(--scf-muted)]">{{
              $t('blog.results', { n: totalRecords })
            }}</span>
            <span
              v-if="selectedCategoryLabel"
              class="rounded-full bg-[var(--scf-accent-soft)] px-3 py-1 text-xs font-bold text-[var(--scf-accent-dark)]"
            >
              {{ selectedCategoryLabel }}
            </span>
          </div>

          <div class="responsive-filter-controls">
            <SearchInputTextComponent
              :placeholder="$t('blog.search')"
              :value="search"
              @update:value="search = $event"
            />
            <Select
              v-model="category"
              :options="[
                { label: $t('blog.filters.all-categories'), value: ALL_CATEGORIES },
                ...categories.map((item) => ({ label: item.name, value: item.slug })),
              ]"
              optionLabel="label"
              optionValue="value"
            />
          </div>
        </div>

        <div v-if="loading" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="i in PAGE_SIZE"
            :key="i"
            class="animate-pulse overflow-hidden rounded-[20px] bg-[var(--scf-bg)]"
          >
            <div class="aspect-[16/10] bg-[var(--scf-accent-soft)]"></div>
            <div class="space-y-3 p-6">
              <div class="h-4 w-1/2 rounded bg-[var(--scf-accent-soft)]"></div>
              <div class="h-3 rounded bg-white"></div>
              <div class="h-3 w-5/6 rounded bg-white"></div>
            </div>
          </div>
        </div>

        <div v-else-if="blogPosts.length" class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <BlogPostCard v-for="post in blogPosts" :key="post.documentId" :post="post" />
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-3 rounded-[20px] bg-[var(--scf-bg)] px-6 py-16 text-center"
        >
          <div
            class="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--scf-accent-soft)]"
          >
            <i class="pi pi-heart-fill text-2xl text-[var(--scf-accent-dark)]"></i>
          </div>
          <span class="eyebrow">{{ $t('blog.list.emptyEyebrow') }}</span>
          <h3 class="display-font text-xl font-semibold text-[var(--scf-ink)]">
            {{ $t('blog.empty') }}
          </h3>
          <p class="max-w-xl text-sm text-[var(--scf-muted)]">{{ $t('blog.empty-subtitle') }}</p>
        </div>

        <div v-if="totalRecords > PAGE_SIZE" class="flex justify-center pt-4">
          <Paginator
            :rows="PAGE_SIZE"
            :totalRecords="totalRecords"
            :first="(currentPage - 1) * PAGE_SIZE"
            @page="onPageChange"
          />
        </div>
      </div>
    </section>
  </div>
</template>
