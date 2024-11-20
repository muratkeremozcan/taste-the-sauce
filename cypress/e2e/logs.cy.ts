describe('console', () => {
  beforeEach(() => {
    // use cy.session to log in and store the browser state
    // https://on.cypress.io/session
    cy.session('user session', () => {
      cy.log('**log in**')
      cy.visit('/')
      cy.get('[data-test="username"]').type('standard_user')
      cy.get('[data-test="password"]').type('secret_sauce')
      cy.get('[data-test="login-button"]').click()
      cy.location('pathname').should('equal', '/inventory.html')
    })
    // visit the page "/inventory.html"
    // and we should be logged in already
    // https://on.cypress.io/visit
    cy.visit('/inventory.html', {
      // before the application loads, we can spy on the console.log method
      // give the spy an alias "consoleLog"
      // https://on.cypress.io/spy
    })
  })

  it('logs messages', () => {
    cy.get('select.product_sort_container').select('Price (low to high)')
    // confirm the console.log messages sequence
    // 1: "inventory: sort by option lohi"
    // 2: "inventory: render"
    // Tip: there might be other messages before or after these two
  })
})
