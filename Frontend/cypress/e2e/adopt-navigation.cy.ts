describe('adopt navigation', () => {
  it('navigates from the adopt list to a cat sheet detail', () => {
    cy.intercept('GET', '**/cat-sheets?*', {
      statusCode: 200,
      body: {
        data: [
          {
            documentId: 'sheet-1',
            isDuo: false,
            description: null,
            tarification: null,
            images: [],
            cats: [
              {
                name: 'Félix',
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
          },
        ],
        meta: { pagination: { page: 1, pageSize: 9, total: 1 } },
      },
    }).as('getCatSheets')

    cy.intercept('GET', '**/cat-sheets/sheet-1?*', {
      statusCode: 200,
      body: {
        data: {
          documentId: 'sheet-1',
          isDuo: false,
          description: null,
          tarification: null,
          images: [],
          cats: [
            {
              name: 'Félix',
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
        },
      },
    }).as('getCatSheetDetail')

    cy.visit('/adopt')
    cy.wait('@getCatSheets')
    cy.get('[data-cy=cat-sheet-card]').first().find('[data-cy=cat-sheet-see-more]').click()

    cy.wait('@getCatSheetDetail')
    cy.location('pathname').should('include', '/adopt/sheet-1')
  })
})
