describe('not found page', () => {
  it('shows the 404 page for an unknown route', () => {
    cy.visit('/this-page-does-not-exist-xyz')
    cy.location('pathname').should('eq', '/this-page-does-not-exist-xyz')
    cy.contains(/page introuvable/i).should('be.visible')
  })

  it('navigates back home from the 404 page', () => {
    cy.visit('/this-page-does-not-exist-xyz')
    cy.contains('button', /retour à l.accueil/i).click()
    cy.location('pathname').should('eq', '/home')
  })
})
