// cypress/e2e/dashboard_tabs_spec.cy.js
describe('CRM Dashboard Navigation', () => {
    beforeEach(() => {
      // Use the custom auth command to log in
      cy.authenticateWithSso()
    })
  
    it('should navigate to Contacts tab', () => {
      // Click the Contacts tab
      cy.get('a').contains('Contacts').click()
      
      // Verify the Contacts component is displayed
      cy.contains('h2', 'Contacts').should('be.visible')
      cy.get('.contact-form').should('exist')
    })
  
    it('should navigate to Tasks tab', () => {
      // Click the Tasks tab
      cy.get('a').contains('Tasks').click()
      
      // Verify the Tasks component is displayed
      cy.contains('h2', 'Tasks').should('be.visible')
      cy.get('.task-form').should('exist')
    })
    
    // Add more tests for each dashboard tab
  })