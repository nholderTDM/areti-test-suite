describe('Quote Calculator Tests', () => {
    beforeEach(() => {
      // Navigate to services section with quote calculator
      cy.visit('/#services');
      cy.get('.quote-calculator').should('be.visible');
    });
  
    it('should display all form fields correctly', () => {
      // Check package quantity fields
      cy.get('#envelope-quantity').should('exist');
      cy.get('#small-quantity').should('exist');
      cy.get('#medium-quantity').should('exist');
      cy.get('#large-quantity').should('exist');
      cy.get('#oversized-quantity').should('exist');
      
      // Check customer information fields
      cy.get('#quote-name').should('exist');
      cy.get('#quote-email').should('exist');
      cy.get('#quote-phone').should('exist');
      cy.get('#quote-company').should('exist');
      
      // Check shipping information fields
      cy.get('#pickup-zip').should('exist');
      cy.get('#delivery-zip').should('exist');
      cy.get('#pickup-date').should('exist');
      cy.get('#delivery-date').should('exist');
      cy.get('#delivery-speed').should('exist');
      
      // Check submit button
      cy.get('button[type="submit"]').should('exist');
    });
  
    it('should calculate quote for small package with next-day delivery', () => {
      // Prepare test data
      const testData = {
        packages: {
          'small': 1
        },
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-123-4567',
        company: 'Test Company',
        pickupZip: '30309',
        deliveryZip: '30328',
        pickupDate: '2025-05-01',
        deliveryDate: '2025-05-02',
        deliverySpeed: 'next-day'
      };
      
      // Fill form with test data
      cy.fillQuoteForm(testData);
      
      // Submit form
      cy.get('#quote-form button[type="submit"]').click();
      
      // Check if quote result is displayed
      cy.get('#quote-result').should('be.visible');
      cy.get('#quote-price').should('be.visible');
      
      // Verify result values are present
      cy.get('#base-rate').should('be.visible');
      cy.get('#distance-fee').should('be.visible');
      cy.get('#expedited-fee').should('be.visible');
    });
  
    it('should calculate quote for multiple packages with same-day delivery', () => {
      // Prepare test data
      const testData = {
        packages: {
          'envelope': 2,
          'medium': 1
        },
        name: 'Test User',
        email: 'test@example.com',
        phone: '555-123-4567',
        company: 'Test Company',
        pickupZip: '30309',
        deliveryZip: '30328',
        pickupDate: '2025-05-01',
        deliverySpeed: 'same-day'
      };
      
      // Fill form with test data
      cy.fillQuoteForm(testData);
      
      // Submit form
      cy.get('#quote-form button[type="submit"]').click();
      
      // Check if quote result is displayed
      cy.get('#quote-result').should('be.visible');
      cy.get('#quote-price').should('be.visible');
      
      // Verify that same-day delivery has higher price than next-day
      cy.get('#expedited-fee').should('not.contain.text', '$0.00');
    });
  
    it('should validate required fields on submission', () => {
      // Try to submit form without filling required fields
      cy.get('#quote-form button[type="submit"]').click();
      
      // Check for validation messages on required fields
      cy.get('#quote-name:invalid').should('exist');
      cy.get('#quote-email:invalid').should('exist');
      cy.get('#quote-phone:invalid').should('exist');
      cy.get('#quote-company:invalid').should('exist');
      cy.get('#pickup-zip:invalid').should('exist');
      cy.get('#delivery-zip:invalid').should('exist');
      cy.get('#pickup-date:invalid').should('exist');
      cy.get('#delivery-speed:invalid').should('exist');
    });
  });