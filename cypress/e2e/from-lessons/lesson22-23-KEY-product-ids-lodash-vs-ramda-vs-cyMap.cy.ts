import { LoginPage } from '@support/pages/login.page'
const { _ } = Cypress
import { map, invoker, uniq } from 'ramda'

describe('Products', () => {
  // create a small type on the fly using jsdoc comment
  // just to help type check help us
  /** @type {{username: string, password: string}} */
  const user = Cypress.env('users').standard
  // we can even check if the user object is valid
  if (!user) {
    throw new Error('Missing the standard user')
  }

  // before each test, quickly login the user
  // or restore the previous user session
  beforeEach(() => {
    LoginPage.login(user.username, user.password)
    cy.visit('/inventory.html')
    cy.location('pathname').should('equal', '/inventory.html')
  })

  it('have unique ids', () => {
    // get all inventory items, there should be more than 3
    // https://on.cypress.io/get
    // https://on.cypress.io/should
    cy.get('.inventory_item')
      .should('have.length.gt', 3)
      .invoke('toArray')
      // .then((els) => els.map((el) => el.getAttribute('data-itemid'))) // vanilla js
      // .then((els) => _.map(els, (el) => el.getAttribute('data-itemid'))) // lodash
      // .then(map((el) => el.getAttribute('data-itemid'))) // ramda
      .apply(map(invoker(1, 'getAttribute')('data-itemid'))) // better ramda
      // .map((el) => el.getAttribute('data-itemid')) // cypress-map
      .should((ids) => {
        expect(ids).to.deep.equal(uniq(ids))
      })
  })

  it('have unique ids (better version lesson23)', () => {
    // get all inventory items, there should be more than 3
    // https://on.cypress.io/get
    // https://on.cypress.io/should
    cy.get('.inventory_item')
      .should('have.length.greaterThan', 3)
      .mapInvoke('getAttribute', 'data-itemid')
      .should((ids) => {
        expect(ids).to.deep.equal(_.uniq(ids))
      })
  })
})
