// cypress/e2e/login_spec.cy.js
describe('CRM Dashboard Login', () => {
    it('should show login page with correct elements', () => {
      // Visit the CRM Dashboard URL
      cy.visit('/dashboard') // Adjust if your dashboard is at a different URL
  
      // Check for login elements
      cy.contains('Areti Alliance CRM').should('be.visible')
      cy.contains('Sign in to your account').should('be.visible')
      cy.get('button').contains('Sign in with SSO').should('be.visible')
    })
    it('should login successfully with valid credentials', function() {
        // Get credentials from fixture
        const credentials = this.authData.validUser
        
        // For SSO login
        cy.get('button').contains('Sign in with SSO').click()
        
     // If your SSO presents a login form, handle it here
cy.origin('dev-eprewkd4xyuf3khb.us.auth0.com', { args: { credentials } }, ({ credentials }) => {
    // Wait for the Auth0 login form to load
    cy.get('input[name="username"], input[type="email"]', { timeout: 10000 }).should('be.visible')
    
    // Fill in credentials
    cy.get('input[name="username"], input[type="email"]').type(credentials.username || credentials.email)
    cy.get('input[name="password"], input[type="password"]').type(credentials.password)
    
    // Submit the form
    cy.get('button[type="submit"]').click()
    
    // If there's an additional consent or permission screen, handle it here
    cy.get('button[value="accept"], button.auth0-lock-submit', { timeout: 5000 })
      .should('be.visible')
      .click()
      .then(() => {
        cy.log('Successfully authenticated with Auth0')
        })
      })
  })
})