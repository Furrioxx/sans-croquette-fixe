const buildCatSheet = (documentId: string, name: string) => ({
  documentId,
  isDuo: false,
  description: null,
  tarification: null,
  images: [],
  cats: [
    {
      name,
      birthDate: '2022-01-01',
      gender: 'male',
      catStatus: 'en_refuge',
      cat_moods: [],
      vaccinated: true,
      sterilized: true,
      identified: true,
      decontaminate: true,
      catFriendly: 'yes',
      dogFriendly: 'yes',
      childFriendly: 'yes',
    },
  ],
})

describe('discover swipe deck', () => {
  it('advances the deck on like/pass and shows the empty state once exhausted', () => {
    // Le composable useTinderDeck relance fetchNextBatch() après chaque swipe tant que le deck
    // a moins de 5 cartes ; ce compteur simule un backend qui n'a plus de résultats après le
    // premier lot, pour atteindre l'état "exhausted" de façon déterministe en 2 swipes.
    let callCount = 0
    cy.intercept('GET', '**/cat-sheets?*', (req) => {
      callCount += 1
      const body =
        callCount === 1
          ? { data: [buildCatSheet('sheet-a', 'Félix'), buildCatSheet('sheet-b', 'Rex')], meta: {} }
          : { data: [], meta: {} }
      req.reply({ statusCode: 200, body })
    }).as('catSheets')

    cy.visit('/discover')
    cy.wait('@catSheets')
    cy.contains('h3', 'Félix').should('be.visible')

    cy.get('[data-cy=discover-like]').click()
    cy.contains('h3', 'Rex', { timeout: 6000 }).should('be.visible')
    // Laisse l'animation de fling (300ms, TinderCard.vue) se terminer avant le swipe
    // suivant : sinon topCardRef peut encore pointer sur la carte précédente en cours d'envol.
    cy.wait(500)

    cy.get('[data-cy=discover-pass]').click()
    cy.contains('Plus de chats à découvrir', { timeout: 6000 }).should('be.visible')
  })
})
