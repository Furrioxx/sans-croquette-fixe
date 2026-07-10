<script setup lang="ts">
import type { BlogPost } from '@/models/BlogPost'
import { RouteNames } from '@/router/routeNames'
import {
  formatBlogDate,
  getBlogAuthorLabel,
  getBlogMediaUrl,
  getBlogPlaceholderLabel,
} from '@/utils/blogUtils'

const props = defineProps<{ post: BlogPost }>()
</script>

<template>
  <article
    class="flex h-full flex-col overflow-hidden rounded-[20px] bg-white transition-transform hover:-translate-y-1"
  >
    <div class="aspect-[16/10] overflow-hidden bg-[var(--scf-bg)]">
      <img
        v-if="props.post.cover"
        :src="getBlogMediaUrl(props.post.cover.url)"
        :alt="props.post.title"
        class="h-full w-full object-cover"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center bg-[var(--scf-accent-soft)]"
      >
        <span class="display-font text-3xl font-bold text-[var(--scf-accent-dark)]">
          {{ getBlogPlaceholderLabel(props.post.title) }}
        </span>
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 p-6">
      <div
        class="flex flex-wrap items-center gap-2.5 text-xs font-semibold text-[var(--scf-muted)]"
      >
        <span
          class="rounded-full bg-[var(--scf-accent-soft)] px-3 py-1 text-[11px] font-bold uppercase text-[var(--scf-accent-dark)]"
        >
          {{ props.post.category?.name || 'Actualité' }}
        </span>
        <span>{{ formatBlogDate(props.post.publishedAt || props.post.createdAt) }}</span>
      </div>

      <h3 class="display-font line-clamp-2 text-lg font-semibold text-[var(--scf-ink)]">
        {{ props.post.title }}
      </h3>
      <p class="line-clamp-3 text-sm leading-6 text-[var(--scf-text)]">
        {{ props.post.excerpt || props.post.content }}
      </p>

      <div class="mt-auto flex items-center justify-between gap-3 pt-2">
        <span class="line-clamp-1 text-xs font-semibold text-[var(--scf-muted)]">{{
          getBlogAuthorLabel(props.post)
        }}</span>
        <router-link
          :to="{ name: RouteNames.BLOG_DETAIL, params: { identifier: props.post.slug } }"
          class="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-[var(--scf-accent-dark)] hover:underline"
        >
          {{ $t('blog.read-more') }}
          <i class="pi pi-arrow-right text-xs"></i>
        </router-link>
      </div>
    </div>
  </article>
</template>
