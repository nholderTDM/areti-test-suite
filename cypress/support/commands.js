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

// Command to authenticate with CRM using SSO
Cypress.Commands.add('authenticateWithSso', () => {
  // Set preserveAuthCookies to true for this authentication process
  Cypress.env('preserveAuthCookies', true);
  
  // Visit the dashboard
  cy.visit('/dashboard');
  
  // Click SSO button
  cy.get('button').contains('Sign in with SSO').click();
  
  // Get credentials from environment variables
  const username = Cypress.env('AUTH_USERNAME');
  const password = Cypress.env('AUTH_PASSWORD');
  
  // Handle Auth0 login form
  cy.origin('dev-eprewkd4xyuf3khb.us.auth0.com', { args: { username, password } }, 
    ({ username, password }) => {
      // Wait for login form and fill credentials
      cy.get('input[name="username"], input[type="email"]', { timeout: 20000 }).should('be.visible').type(username);
      cy.get('input[name="password"], input[type="password"]').type(password, { log: false });
      cy.get('button[type="submit"]').click();
      
      // Handle consent if needed
      cy.get('button[value="accept"], button.auth0-lock-submit', { timeout: 10000 })
        .should('be.visible')
        .then($btn => {
          if ($btn.length > 0) {
            cy.wrap($btn).click();
          }
        });
    }
  );
  
  // Verify login success
  cy.url().should('include', '/dashboard');
  cy.get('.nav-container', { timeout: 20000 }).should('be.visible');
});

// Command to authenticate by directly setting auth token
Cypress.Commands.add('loginByAuthToken', () => {
  const authToken = Cypress.env('AUTH_TOKEN');
  
  // Set the auth token directly in localStorage
  cy.visit('/dashboard', {
    onBeforeLoad: (window) => {
      window.localStorage.setItem('authToken', authToken);
    }
  });
  
  // Refresh to apply the token
  cy.reload();
  
  // Verify login success
  cy.get('.nav-container', { timeout: 20000 }).should('be.visible');
});

// Command to navigate to a CRM module
Cypress.Commands.add('navigateToCrmModule', (module) => {
  cy.get(`a`).contains(new RegExp(`^${module}$`, 'i')).click();
  cy.contains(`${module} Dashboard`, { matchCase: false }).should('be.visible');
});

// Command to test main website navigation
Cypress.Commands.add('navigateToWebsiteSection', (section) => {
  cy.get(`a[href*="#${section}"]`).first().click();
  cy.get(`#${section}`).should('be.visible');
});

// Command to test responsive behavior
Cypress.Commands.add('setViewportAndTest', (width, height, element, shouldBeVisible) => {
  cy.viewport(width, height);
  if (shouldBeVisible) {
    cy.get(element).should('be.visible');
  } else {
    cy.get(element).should('not.be.visible');
  }
});

// Command to fill the quote form
Cypress.Commands.add('fillQuoteForm', (formData) => {
  // Fill package quantities
  if (formData.packages) {
    Object.entries(formData.packages).forEach(([type, quantity]) => {
      cy.get(`#${type}-quantity`).clear().type(quantity.toString());
    });
  }
  
  // Fill customer info
  cy.get('#quote-name').clear().type(formData.name);
  cy.get('#quote-email').clear().type(formData.email);
  cy.get('#quote-phone').clear().type(formData.phone);
  cy.get('#quote-company').clear().type(formData.company);
  
  // Fill shipping info
  cy.get('#pickup-zip').clear().type(formData.pickupZip);
  cy.get('#delivery-zip').clear().type(formData.deliveryZip);
  cy.get('#pickup-date').clear().type(formData.pickupDate);
  
  if (formData.deliveryDate) {
    cy.get('#delivery-date').clear().type(formData.deliveryDate);
  }
  
  // Select delivery speed
  cy.get('#delivery-speed').select(formData.deliverySpeed);
});