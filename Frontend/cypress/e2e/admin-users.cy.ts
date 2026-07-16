describe('admin users management', () => {
  it('opens the edit modal for a user via the keyboard-accessible popover action', () => {
    cy.intercept('POST', '**/auth/local', { statusCode: 200, body: { jwt: 'fake-jwt' } }).as('login')
    cy.intercept('GET', '**/user-profiles/me', {
      statusCode: 200,
      body: { username: 'admin', role: { name: 'Admin' } },
    }).as('me')
    cy.intercept('GET', /\/api\/users\?/, {
      statusCode: 200,
      body: [
        {
          id: 1,
          username: 'volunteer1',
          email: 'v1@scf.fr',
          blocked: false,
          confirmed: true,
          role: { id: 2, name: 'Volunteer', type: 'volunteer' },
        },
      ],
    }).as('getUsers')
    cy.intercept('GET', /\/api\/users\/1\?/, {
      statusCode: 200,
      body: {
        id: 1,
        username: 'volunteer1',
        email: 'v1@scf.fr',
        blocked: false,
        confirmed: true,
        newsletterOptIn: false,
        role: { id: 2, name: 'Volunteer', type: 'volunteer' },
      },
    }).as('getUserById')
    cy.intercept('GET', '**/user-roles/available', {
      statusCode: 200,
      body: {
        data: [
          { id: 1, name: 'Admin', type: 'admin' },
          { id: 2, name: 'Volunteer', type: 'volunteer' },
        ],
      },
    }).as('getRoles')

    cy.visit('/login')
    cy.get('#login-email').type('admin@scf.fr')
    cy.get('#login-password').type('Password123!')
    cy.get('[data-cy=login-submit]').click()
    cy.wait('@login')
    cy.wait('@me')

    cy.visit('/dashboard/users')
    cy.wait('@getUsers')

    cy.get('[data-cy=user-row-actions]').click()

    // Le bouton "Modifier" était un <li @click> non focusable au clavier avant correction :
    // ce test vérifie qu'il reçoit bien le focus et s'active avec la touche Entrée.
    cy.get('[data-cy=user-edit-action]').focus().type('{enter}')

    cy.wait('@getUserById')
    cy.wait('@getRoles')
    cy.get('.p-dialog').should('be.visible').and('contain.text', 'volunteer1')
  })
})
