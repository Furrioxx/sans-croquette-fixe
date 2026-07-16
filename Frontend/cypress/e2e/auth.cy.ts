describe('authentication', () => {
  it('logs in successfully and redirects to the dashboard for an admin', () => {
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
    cy.location('pathname').should('include', '/dashboard')
  })

  it('shows an error message when login fails', () => {
    cy.intercept('POST', '**/auth/local', { statusCode: 400, body: {} }).as('loginFail')

    cy.visit('/login')
    cy.get('#login-email').type('wrong@scf.fr')
    cy.get('#login-password').type('wrongpass')
    cy.get('[data-cy=login-submit]').click()

    cy.wait('@loginFail')
    cy.get('[data-cy=login-error]').should('be.visible')
  })

  it('registers successfully and redirects a standard user to home', () => {
    cy.intercept('POST', '**/auth/local/register', { statusCode: 200, body: { jwt: 'fake-jwt' } }).as(
      'register',
    )
    cy.intercept('GET', '**/user-profiles/me', {
      statusCode: 200,
      body: { username: 'newuser', role: { name: 'User' } },
    }).as('me')

    cy.visit('/register')
    cy.get('#register-email').type('newuser@scf.fr')
    cy.get('#register-username').type('newuser')
    cy.get('#register-password').type('Password123!')
    cy.get('#register-confirm-password').type('Password123!')
    cy.get('[data-cy=register-submit]').click()

    cy.wait('@register')
    cy.wait('@me')
    cy.location('pathname').should('eq', '/home')
  })
})
