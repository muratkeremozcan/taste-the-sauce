// @ts-check

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
    // confirm the item prices are sorted in ascending order
    cy.get('[data-test="product_sort_container"]').select('lohi')

    cy.get('.inventory_item_price')
      .map('innerText')
      .mapInvoke('substring', 1)
      .map(Number)
      .should('be.ascending')
  })

  it('by price highest to lowest', () => {
    cy.log('**log in**')
    cy.visit('/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.location('pathname').should('equal', '/inventory.html')
    cy.log('**sort by price low to high**')
    // sort the items from high to low price
    // confirm the item prices are sorted from highest to lowest
    cy.get('[data-test="product_sort_container"]').select('hilo')

    cy.get('.inventory_item_price')
      .map('innerText')
      .mapInvoke('substring', 1)
      .map(Number)
      .should('be.descending')

    // non chai version 2
    cy.get('.inventory_item_price')
      .map('innerText')
      .mapInvoke('substring', 1)
      .map(Number)
      .should((numbers) => {
        const sortedLodash = Cypress._.sortBy(numbers)
        expect(sortedLodash.reverse()).to.deep.eq(numbers)
      })
  })
})
