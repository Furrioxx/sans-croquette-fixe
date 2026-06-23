import type { StrapiMedia } from './Cat'
import type { User } from './User'

export interface BlogPost {
  id: number
  documentId: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  isPublished: boolean
  cover: StrapiMedia | null
  author: User | null
  createdAt: string
  updatedAt: string
}

export interface BlogPostPostPut {
  title: string
  excerpt: string | null
  content: string
  isPublished: boolean
  cover: number | null
}
