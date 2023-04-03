// enables intelligent code completion for Cypress commands
// https://on.cypress.io/intelligent-code-completion
/// <reference types="cypress" />

// https://www.chaijs.com/plugins/chai-sorted/
chai.use(require('chai-sorted'))

describe('sorting', () => {
  it('by price lowest to highest', () => {
    cy.log('**log in**')
    cy.visit('/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.location('pathname').should('equal', '/inventory.html')
    cy.log('**sort by price low to high**')
    // sort the items from low to high

    const getPrices = () =>
      cy
        .get('.inventory_item_price')
        .map('innerText')
        .mapInvoke('slice', 1)
        .map(Number)
        .print('sorted prices %o')

    const sortByPrice = (order: string | number | (string | number)[]) =>
      cy.get('[data-test="product_sort_container"]').select(order)
    // confirm the item prices are sorted in ascending order

    sortByPrice('lohi')
    getPrices().should('be.ascending')

    cy.log('**sort by price high to low**')
    // sort the items from high to low price
    sortByPrice('hilo')
    // confirm the item prices are sorted from highest to lowest
    getPrices().should('be.descending')
  })
})
