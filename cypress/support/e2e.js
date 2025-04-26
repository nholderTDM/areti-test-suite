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
//import 'cypress-mochawesome-reporter/register'

// Better handling of uncaught exceptions and failures
Cypress.on('uncaught:exception', (err, runnable) => {
  // Log the error for debugging
  console.error('Uncaught exception:', err.message);
  
  // Returning false prevents Cypress from failing the test
  // You can add specific error message checks here
  return false;
});

// Log additional information about tests
Cypress.on('test:before:run', (attributes) => {
  const testTitle = attributes.title;
  console.log(`Running test: "${testTitle}"`);
});

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

// Add a viewport check at the start of each test
beforeEach(() => {
  // Check if we're in a mobile or responsive test
  const testTitle = Cypress.currentTest.title.toLowerCase();
  
  if (testTitle.includes('mobile') || testTitle.includes('responsive')) {
    cy.viewport('iphone-x');
    cy.log('Set viewport to mobile for responsive/mobile test');
  } else {
    // Use the default viewport from config
    cy.log('Using default viewport from configuration');
  }
});