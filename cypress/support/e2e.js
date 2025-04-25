// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:

// cypress/support/e2e.js
import './commands'
import 'cypress-mochawesome-reporter/register'

// Clear cookies and localStorage before each test based on config
if (Cypress.env('clearCookiesBeforeTests')) {
  beforeEach(() => {
    cy.clearCookies();
    cy.clearLocalStorage();
    cy.log('Cleared cookies and localStorage before test');
  });
}

// Preserve cookies in certain tests when needed
Cypress.Cookies.defaults({
  preserve: (cookie) => {
    // Preserve Auth0 and other auth cookies when specifically requested
    return cookie.name.includes('auth') && Cypress.env('preserveAuthCookies');
  }
});

// Handle uncaught exceptions
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false prevents Cypress from failing the test
  console.error('Uncaught exception:', err.message);
  return false;
});