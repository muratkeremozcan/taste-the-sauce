// first import the 3rd party Cypress plugins
// to make them available in every command

// https://github.com/bahmutov/cypress-code-coverage
import '@bahmutov/cypress-code-coverage/support'

// https://github.com/bahmutov/cypress-data-session
import 'cypress-data-session'
// https://github.com/bahmutov/cypress-map
import 'cypress-map'

// https://www.chaijs.com/plugins/chai-sorted/
// @ts-ignore
chai.use(require('chai-sorted'))

// @ts-ignore
require('cypress-watch-and-reload/support')

// import custom commands
import './commands'

// @ts-ignore
Cypress.Commands.add(
  'fillForm',
  // @ts-ignore
  { prevSubject: 'element' },
  ($form, inputs) => {
    cy.wrap($form, { log: false }).within(() => {
      // iterate over the input fields
      // and type into each selector (key) the value
      Cypress._.forEach(inputs, (value, selector) => {
        cy.get(selector).type(value)
      })
    })
  },
)

/*
Cypress.Commands.add(
  'fillFormInitial',
  { prevSubject: 'element' },
  ($form, first, last, zip) => {
    // fill the checkout information form
    cy.wrap($form, { log: false }).within(() => {
      cy.get('#first-name').type(first)
      cy.get('#last-name').type(last)
      cy.get('#postal-code').type(zip)
    })
    // the command yields the result of the last command
    // which is cy.within which yields its subject,
    // thus this command yields the form element!
  },
)
*/

const login = (name: string, password: string) => {
  cy.visit('/')
  cy.get('[data-test="username"]').type(name)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
  cy.location('pathname').should('equal', '/inventory.html')
}

Cypress.Commands.add('dataSessionLogin', (name, password) => {
  cy.dataSession({
    name,
    setup() {
      login(name, password)
      return cy.getCookie('session-username').should('exist')
    },
    recreate(userCookie: Partial<Cypress.SetCookieOptions> | undefined) {
      // @ts-expect-error
      cy.setCookie('session-username', userCookie.value, userCookie)
      cy.visit('/inventory.html')
      cy.location('pathname').should('equal', '/inventory.html')
    },
    shareAcrossSpecs: true,
    expires: 9_000, // assume that user cookie session is only valid for 10 seconds (per the code), so we want data session to expire too
  })
})

Cypress.Commands.add('sessionLogin', (name, password) => {
  cy.session({ name, password }, () => login(name, password), {
    validate: () => {
      cy.getCookie('session-username').its('value').should('eq', name)
    },
    cacheAcrossSpecs: true,
  })
  return cy.visit('/inventory.html')
})
