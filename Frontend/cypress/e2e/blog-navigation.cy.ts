describe('blog navigation', () => {
  it('navigates from the blog list to an article', () => {
    cy.intercept('GET', '**/blog-categories?*', {
      statusCode: 200,
      body: { data: [], meta: { pagination: { page: 1, pageSize: 100, pageCount: 0, total: 0 } } },
    }).as('getCategories')

    cy.intercept('GET', '**/blog-posts?*', {
      statusCode: 200,
      body: {
        data: [
          {
            documentId: 'post-1',
            slug: 'article-de-test',
            title: 'Article de test',
            excerpt: 'Un extrait pour le test',
            content: 'Le contenu complet de l’article de test.',
            cover: null,
            category: null,
            publishedAt: '2024-01-01T00:00:00Z',
            createdAt: '2024-01-01T00:00:00Z',
          },
        ],
        meta: { pagination: { page: 1, pageSize: 6, pageCount: 1, total: 1 } },
      },
    }).as('getBlogPosts')

    cy.intercept('GET', '**/blog-posts/article-de-test?*', {
      statusCode: 200,
      body: {
        data: {
          documentId: 'post-1',
          slug: 'article-de-test',
          title: 'Article de test',
          excerpt: 'Un extrait pour le test',
          content: 'Le contenu complet de l’article de test.',
          cover: null,
          category: null,
          publishedAt: '2024-01-01T00:00:00Z',
          createdAt: '2024-01-01T00:00:00Z',
        },
      },
    }).as('getBlogPostDetail')

    cy.visit('/blog')
    cy.wait('@getBlogPosts')
    cy.get('[data-cy=blog-post-card]').first().find('[data-cy=blog-post-read-more]').click()

    cy.wait('@getBlogPostDetail')
    cy.location('pathname').should('eq', '/blog/article-de-test')
    cy.contains('h1', 'Article de test').should('be.visible')
  })

  it('shows the not-found state for a missing article', () => {
    cy.intercept('GET', '**/blog-posts/unknown-slug?*', { statusCode: 404, body: {} }).as('getMissing')
    cy.intercept('GET', '**/blog-posts?*', {
      statusCode: 200,
      body: { data: [], meta: { pagination: { page: 1, pageSize: 1, pageCount: 0, total: 0 } } },
    }).as('getFallbackList')

    cy.visit('/blog/unknown-slug')
    cy.wait('@getMissing')
    cy.wait('@getFallbackList')
    cy.contains(/article introuvable/i).should('be.visible')
  })
})
