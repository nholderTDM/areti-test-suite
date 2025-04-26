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
  cy.visit('/dashboard', { timeout: 30000 });
  
  // Click SSO button - make it more resilient
  cy.get('button').contains(/Sign in with SSO/i, { timeout: 10000 })
    .should('be.visible')
    .click();
  
  // Get credentials from environment variables with fallback
  const username = Cypress.env('AUTH_USERNAME') || 'demoadmin';
  const password = Cypress.env('AUTH_PASSWORD') || 'aretidemo';
  
  // Handle Auth0 login form with better error handling
  cy.origin('dev-eprewkd4xyuf3khb.us.auth0.com', { args: { username, password } }, 
    ({ username, password }) => {
      // Wait for login form and fill credentials with longer timeout
      cy.get('input[name="username"], input[type="email"]', { timeout: 30000 })
        .should('be.visible')
        .clear()
        .type(username, { delay: 100 });
        
      cy.get('input[name="password"], input[type="password"]')
        .should('be.visible')
        .clear()
        .type(password, { log: false, delay: 100 });
        
      // Click submit button with retry
      cy.get('button[type="submit"]')
        .should('be.visible')
        .click();
      
      // Handle consent screen if it appears, with better error handling
      cy.get('body').then($body => {
        if ($body.find('button[value="accept"], button.auth0-lock-submit').length > 0) {
          cy.get('button[value="accept"], button.auth0-lock-submit')
            .should('be.visible')
            .click();
        }
      });
    }
  );
  
  // Verify login success with increased timeout
  cy.url({ timeout: 30000 }).should('include', '/dashboard');
  cy.get('.nav-container', { timeout: 30000 }).should('be.visible');
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
  
  // Verify login success with better error handling
  cy.get('.nav-container', { timeout: 30000 })
    .should('be.visible')
    .then(() => {
      cy.log('Successfully logged in using auth token');
    });
});

// Command to navigate to a CRM module with retry
Cypress.Commands.add('navigateToCrmModule', (module) => {
  // Retry selector to make it more robust
  cy.get('body').then($body => {
    // Try clicking on exact match
    if ($body.find(`a:contains("${module}")`).length > 0) {
      cy.get(`a:contains("${module}")`).click();
    } 
    // Try case-insensitive match
    else if ($body.find(`a`).filter((i, el) => new RegExp(`^${module}$`, 'i').test($(el).text())).length > 0) {
      cy.get(`a`).filter((i, el) => new RegExp(`^${module}$`, 'i').test($(el).text())).click();
    }
    // Fallback to partial match
    else {
      cy.get(`a`).filter((i, el) => $(el).text().includes(module)).first().click();
    }
  });
  
  // Check for either exact or partial match of module name in dashboard
  cy.contains(new RegExp(`${module}.*Dashboard`, 'i'), { timeout: 10000 })
    .should('be.visible');
});

// Command to test main website navigation with better error handling
Cypress.Commands.add('navigateToWebsiteSection', (section) => {
  // Try multiple strategies to find the navigation element
  cy.get('body').then($body => {
    // Try anchor with href
    if ($body.find(`a[href*="#${section}"]`).length > 0) {
      cy.get(`a[href*="#${section}"]`).first().click();
    }
    // Try by text content
    else if ($body.find(`a:contains("${section}")`).length > 0) {
      cy.get(`a:contains("${section}")`).first().click();
    }
    // Try by ID
    else {
      cy.get(`a`).filter((i, el) => {
        const href = $(el).attr('href');
        return href && href.includes(section);
      }).first().click();
    }
  });
  
  // Verify section is visible with better error handling
  cy.get(`#${section}`, { timeout: 10000 })
    .should('be.visible')
    .then(() => {
      cy.log(`Successfully navigated to ${section} section`);
    });
});

// Command to test responsive behavior with better logging
Cypress.Commands.add('setViewportAndTest', (width, height, element, shouldBeVisible) => {
  cy.viewport(width, height);
  cy.log(`Set viewport to ${width}x${height}`);
  
  if (shouldBeVisible) {
    cy.get(element, { timeout: 10000 })
      .should('be.visible')
      .then(() => {
        cy.log(`Element "${element}" is visible as expected`);
      });
  } else {
    cy.get(element, { timeout: 10000 })
      .should('not.be.visible')
      .then(() => {
        cy.log(`Element "${element}" is hidden as expected`);
      });
  }
});

// Command to fill the quote form with better input handling
Cypress.Commands.add('fillQuoteForm', (formData) => {
  // Fill package quantities with better error handling
  if (formData.packages) {
    Object.entries(formData.packages).forEach(([type, quantity]) => {
      cy.get(`#${type}-quantity`)
        .should('exist')
        .clear({ force: true })
        .type(quantity.toString(), { delay: 50 });
    });
  }
  
  // Fill customer info
  cy.get('#quote-name')
    .should('exist')
    .clear({ force: true })
    .type(formData.name, { delay: 50 });
    
  cy.get('#quote-email')
    .should('exist')
    .clear({ force: true })
    .type(formData.email, { delay: 50 });
    
  cy.get('#quote-phone')
    .should('exist')
    .clear({ force: true })
    .type(formData.phone, { delay: 50 });
    
  cy.get('#quote-company')
    .should('exist')
    .clear({ force: true })
    .type(formData.company, { delay: 50 });
  
  // Fill shipping info
  cy.get('#pickup-zip')
    .should('exist')
    .clear({ force: true })
    .type(formData.pickupZip, { delay: 50 });
    
  cy.get('#delivery-zip')
    .should('exist')
    .clear({ force: true })
    .type(formData.deliveryZip, { delay: 50 });
    
  cy.get('#pickup-date')
    .should('exist')
    .clear({ force: true })
    .type(formData.pickupDate, { delay: 50 });
  
  if (formData.deliveryDate) {
    cy.get('#delivery-date')
      .should('exist')
      .clear({ force: true })
      .type(formData.deliveryDate, { delay: 50 });
  }
  
  // Select delivery speed
  cy.get('#delivery-speed')
    .should('exist')
    .select(formData.deliverySpeed);
});