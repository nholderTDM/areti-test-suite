// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
// cypress/support/commands.js

// Add this to your existing commands.js file
Cypress.Commands.add('authenticateWithSso', () => {
    // Load credentials fixture
    cy.fixture('auth-credentials.json').then((authData) => {
      // Visit the dashboard
      cy.visit('/dashboard')
      
      // Click SSO button
      cy.get('button').contains('Sign in with SSO').click()
      
      // If your SSO requires additional steps, add them here
      // Handle redirects and form fills as needed for your specific SSO
      
      // Verify successful login
      cy.get('.nav-container', { timeout: 10000 }).should('be.visible')
    })
  })

  // cypress/support/commands.js

// Add this to your existing commands.js file
Cypress.Commands.add('loginByAuthToken', () => {
    cy.fixture('auth-credentials.json').then((authData) => {
      // Set the auth token directly in localStorage
      localStorage.setItem('authToken', authData.authToken)
      
      // Refresh to apply the token
      cy.visit('/dashboard')
    })
  })