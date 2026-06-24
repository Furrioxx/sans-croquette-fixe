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
  isPublished: boolean
  isFeatured: boolean
  cover: StrapiMedia | null
  category: BlogCategory | null
  author: User | null
  authorRoleLabel: string | null
  createdAt: string
  updatedAt: string
}

export interface BlogPostPostPut {
  title: string
  excerpt: string | null
  content: string
  seoTitle: string | null
  seoDescription: string | null
  isPublished: boolean
  isFeatured: boolean
  cover: number | null
  category: number | null
}
