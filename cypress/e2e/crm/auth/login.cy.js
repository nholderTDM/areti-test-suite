describe('CRM Dashboard Authentication', () => {
    beforeEach(() => {
      cy.visit('/dashboard');
    });
  
    it('should display login page with all elements', () => {
      // Check login page elements
      cy.get('.max-w-md').within(() => {
        cy.contains('Areti Alliance CRM').should('be.visible');
        cy.contains('Sign in to your account').should('be.visible');
        cy.get('button').contains('Sign in with SSO').should('be.visible');
      });
      
      // Check logo is visible
      cy.get('.w-16.h-16').should('be.visible');
    });
  
    it('should redirect to Auth0 when clicking login button', () => {
      // Click the SSO button
      cy.get('button').contains('Sign in with SSO').click();
      
      // Check that it redirects to Auth0
      cy.url().should('include', 'auth0.com');
    });
  
    it('should successfully login with valid credentials', () => {
      // Use the custom command for authentication
      cy.authenticateWithSso();
      
      // Verify dashboard is loaded after login
      cy.url().should('include', '/dashboard');
      cy.get('.nav-container').should('be.visible');
      cy.get('.text-xl').contains('Dashboard').should('be.visible');
    });
  
    it('should log out successfully', () => {
      // First login
      cy.authenticateWithSso();
      
      // Then click logout
      cy.contains('Logout').click();
      
      // Check redirect to login page
      cy.get('button').contains('Sign in with SSO').should('be.visible');
    });
  });