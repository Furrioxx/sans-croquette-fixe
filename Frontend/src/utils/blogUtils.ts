import type { BlogPost } from '@/models/BlogPost'
import { getCatImageUrl } from '@/utils/catImageUrl'

export const getBlogMediaUrl = getCatImageUrl

export const formatBlogDate = (value: string, locale = 'fr-FR') => {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value))
}

export const getBlogPlaceholderLabel = (title: string) => {
  const first = title.trim().charAt(0).toUpperCase()
  return first || 'B'
}

export const getBlogAuthorLabel = (post: BlogPost) => {
  const username = post.author?.username || 'Sans Croquette Fixe'
  const roleName = post.author?.role?.name

  return roleName ? `${username} · ${roleName}` : username
}
