// https://www.chaijs.com/plugins/chai-sorted/
chai.use(require('chai-sorted'))

describe('sorting', () => {
  beforeEach(() => {
    cy.log('**log in**')
    cy.visit('/')
    cy.get('[data-test="username"]').type('standard_user')
    cy.get('[data-test="password"]').type('secret_sauce')
    cy.get('[data-test="login-button"]').click()
    cy.location('pathname').should('equal', '/inventory.html')
  })

  /**
   * Sorts item by price
   * @param {'lohi'|'hilo'|'za'|'az'} order
   */
  function sortByPrice(order: string | number | (string | number)[]) {
    // confirm the argument value at runtime
    expect(order, 'sort order').to.be.oneOf(['lohi', 'hilo', 'za', 'az'])
    cy.log(`**sort by price ${order}**`)
    cy.get('[data-test="product_sort_container"]').select(order)
  }

  function getPrices() {
    return cy
      .get('.inventory_item_price')
      .map('innerText')
      .mapInvoke('slice', 1)
      .map(Number)
      .print('sorted prices %o')
  }

  function getNames() {
    return cy.get('.inventory_item_name').map('innerText')
  }

  it('by price lowest to highest', () => {
    sortByPrice('lohi')
    getPrices().should('be.ascending')
  })

  it('by price highest to lowest', () => {
    sortByPrice('hilo')
    // confirm the item prices are sorted from highest to lowest
    getPrices().should('be.descending')
  })

  it('by name from A to Z', () => {
    sortByPrice('az')
    getNames().should('be.ascending')
  })

  it('by name from Z to A', () => {
    sortByPrice('za')
    getNames().should('be.descending')
  })
})
