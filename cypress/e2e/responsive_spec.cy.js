// cypress/e2e/responsive_spec.cy.js
describe('Responsive Design Tests', () => {
    beforeEach(() => {
      cy.visit('/')
    })
  
    it('should show hamburger menu on mobile view', () => {
      // Set viewport to mobile size
      cy.viewport(375, 667) // iPhone 8 size
      
      // Check that hamburger menu is visible
      cy.get('#hamburger').should('be.visible')
      
      // Check that main nav is hidden
      cy.get('#nav').should('not.be.visible')
      
      // Click hamburger to open menu
      cy.get('#hamburger').click()
      
      // Check that nav is now visible
      cy.get('#nav').should('be.visible')
    })
  
    it('should show full menu on desktop view', () => {
      // Set viewport to desktop size
      cy.viewport(1280, 800)
      
      // Check that hamburger menu is not visible
      cy.get('#hamburger').should('not.be.visible')
      
      // Check that main nav is visible
      cy.get('#nav').should('be.visible')
    })
  })