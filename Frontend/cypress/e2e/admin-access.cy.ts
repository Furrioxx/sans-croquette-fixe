describe('admin access', () => {
  it('redirects an unauthenticated user to login when visiting the dashboard', () => {
    cy.visit('/dashboard')
    cy.location('pathname').should('eq', '/login')
  })

  it('redirects a logged-in user without sufficient role to the unauthorized page', () => {
    cy.intercept('POST', '**/auth/local', { statusCode: 200, body: { jwt: 'fake-jwt' } }).as('login')
    cy.intercept('GET', '**/user-profiles/me', {
      statusCode: 200,
      body: { username: 'user', role: { name: 'User' } },
    }).as('me')

    cy.visit('/login')
    cy.get('#login-email').type('user@scf.fr')
    cy.get('#login-password').type('Password123!')
    cy.get('[data-cy=login-submit]').click()
    cy.wait('@login')
    cy.wait('@me')

    cy.visit('/dashboard')
    cy.wait('@me')
    cy.get('[data-cy=unauthorized-title]').should('be.visible')
  })

  it('grants access to an admin user', () => {
    cy.intercept('POST', '**/auth/local', { statusCode: 200, body: { jwt: 'fake-jwt' } }).as('login')
    cy.intercept('GET', '**/user-profiles/me', {
      statusCode: 200,
      body: { username: 'admin', role: { name: 'Admin' } },
    }).as('me')

    cy.visit('/login')
    cy.get('#login-email').type('admin@scf.fr')
    cy.get('#login-password').type('Password123!')
    cy.get('[data-cy=login-submit]').click()
    cy.wait('@login')
    cy.wait('@me')

    cy.get('[data-cy=admin-dashboard]').should('be.visible')
  })
})
