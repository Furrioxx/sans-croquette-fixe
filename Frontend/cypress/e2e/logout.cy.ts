describe('logout', () => {
  it('logs an admin out and blocks further access to the dashboard', () => {
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
    cy.get('[data-cy=admin-logout]').click()

    cy.location('pathname').should('eq', '/home')

    cy.visit('/dashboard')
    cy.location('pathname').should('eq', '/login')
  })
})
