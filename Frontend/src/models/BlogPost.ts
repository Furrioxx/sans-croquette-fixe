import type { StrapiMedia } from './Cat'
import type { User } from './User'
import type { BlogCategory } from './BlogCategory'

export interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  seoTitle: string | null
  seoDescription: string | null
  publishedAt: string | null
  isFeatured: boolean
  cover: StrapiMedia | null
  category: BlogCategory | null
  author: User | null
  createdAt: string
  updatedAt: string
}

export interface BlogPostPostPut {
  title: string
  slug: string
  excerpt: string | null
  content: string
  seoTitle: string | null
  seoDescription: string | null
  isFeatured: boolean
  cover: number | null
  category: string | null
  author?: number | null
  publishedAt?: string | null
}

export interface BlogPostFormValues extends BlogPostPostPut {
  isPublished: boolean
}
