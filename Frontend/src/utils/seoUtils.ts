const upsertMeta = (selector: string, attributes: Record<string, string>) => {
  let element = document.head.querySelector(selector) as HTMLMetaElement | null

  if (!element) {
    element = document.createElement('meta')
    document.head.appendChild(element)
  }

  Object.entries(attributes).forEach(([key, value]) => {
    element?.setAttribute(key, value)
  })
}

const upsertLink = (rel: string, href: string) => {
  let element = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null

  if (!element) {
    element = document.createElement('link')
    element.rel = rel
    document.head.appendChild(element)
  }

  element.href = href
}

export const SeoUtils = {
  applyPageSeo: (params: {
    title: string
    description: string
    image?: string | null
    canonicalPath: string
  }) => {
    const siteName = import.meta.env.VITE_APP_NAME || 'Sans Croquette Fixe'
    const siteUrl = window.location.origin.replace(/\/$/, '')
    const fullTitle = `${params.title} - ${siteName}`
    const canonicalUrl = `${siteUrl}${params.canonicalPath.startsWith('/') ? '' : '/'}${params.canonicalPath}`

    document.title = fullTitle

    upsertMeta('meta[name="description"]', {
      name: 'description',
      content: params.description,
    })

    upsertMeta('meta[property="og:title"]', {
      property: 'og:title',
      content: fullTitle,
    })

    upsertMeta('meta[property="og:description"]', {
      property: 'og:description',
      content: params.description,
    })

    upsertMeta('meta[property="og:type"]', {
      property: 'og:type',
      content: 'article',
    })

    upsertMeta('meta[property="og:url"]', {
      property: 'og:url',
      content: canonicalUrl,
    })

    if (params.image) {
      upsertMeta('meta[property="og:image"]', {
        property: 'og:image',
        content: params.image,
      })
    }

    upsertLink('canonical', canonicalUrl)
  },
}
