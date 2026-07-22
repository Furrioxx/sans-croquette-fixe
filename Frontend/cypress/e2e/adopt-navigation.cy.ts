describe('adopt navigation', () => {
  it('navigates from the adopt list to a cat sheet detail', () => {
    const catSheet = {
      documentId: 'sheet-1',
      isDuo: false,
      description: null,
      tarification: null,
      images: [],
      cats: [
        {
          name: 'Felix',
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
    }

    cy.intercept('GET', '**/cat-sheets?*', (req) => {
      const isDetailRequest = req.url.includes('documentId')

      req.reply({
        statusCode: 200,
        body: {
          data: [catSheet],
          meta: {
            pagination: {
              page: 1,
              pageSize: isDetailRequest ? 1 : 9,
              total: 1,
            },
          },
        },
      })
    }).as('getCatSheets')

    cy.visit('/adopt')
    cy.wait('@getCatSheets')
    cy.get('[data-cy=cat-sheet-card]').first().find('[data-cy=cat-sheet-see-more]').click()

    cy.wait('@getCatSheets')
    cy.location('pathname').should('include', '/adopt/sheet-1')
  })
})
