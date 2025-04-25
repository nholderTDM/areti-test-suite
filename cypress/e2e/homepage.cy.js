// cypress/e2e/home_page_spec.cy.js
describe('Home Page Tests', () => {
  beforeEach(() => {
    // Visit the home page before each test
    cy.visit('/')
  })

  it('should have the correct title', () => {
    // Test that the page title contains the expected text
    cy.title().should('include', 'Areti Alliance')
  })

  it('should have a visible logo', () => {
    // Test that the logo is visible
    cy.get('.logo').should('be.visible')
  })

  it('should navigate to Services section when clicking Services link', () => {
    // Test navigation to Services section
    cy.get('a[href*="#services"]').first().click()
    cy.get('#services').should('be.visible')
  })

  it('should show the quote calculator form', () => {
    // Test that the quote calculator form exists and is functional
    cy.get('#quote-form').should('exist')
    cy.get('#pickup-zip').type('30309')
    cy.get('#delivery-zip').type('30328')
    // Additional form interaction can be added here
  })
})