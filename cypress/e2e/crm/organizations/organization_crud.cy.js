describe('CRM Organizations Module - CRUD Operations', () => {
    beforeEach(() => {
      // Login and navigate to Organizations module
      cy.authenticateWithSso();
      cy.navigateToCrmModule('Organizations');
    });
  
    it('should display organizations list correctly', () => {
      // Check organizations header and buttons
      cy.contains('h2', 'Organizations').should('be.visible');
      cy.contains('button', 'Add Organization').should('be.visible');
      
      // Check if table exists (either with organizations or empty state)
      cy.get('.overflow-x-auto, .text-center.py-8').should('exist');
    });
  
    it('should open organization form when clicking Add Organization', () => {
      // Click Add Organization button
      cy.contains('button', 'Add Organization').click();
      
      // Check form appears
      cy.get('form').should('be.visible');
      cy.contains('h3', 'Add New Organization').should('be.visible');
      
      // Check all required form fields
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="industry"]').should('be.visible');
      cy.get('input[name="website"]').should('be.visible');
      cy.get('select[name="size"]').should('be.visible');
      cy.get('input[name="address"]').should('be.visible');
      cy.get('textarea[name="notes"]').should('be.visible');
    });
  
    it('should create a new organization successfully', () => {
      // Generate a unique name to avoid duplicates
      const timestamp = new Date().getTime();
      const testName = `Test Org ${timestamp}`;
      
      // Click Add Organization button
      cy.contains('button', 'Add Organization').click();
      
      // Fill the form
      cy.get('input[name="name"]').type(testName);
      cy.get('input[name="industry"]').type('Technology');
      cy.get('input[name="website"]').type('https://example.com');
      cy.get('select[name="size"]').select('medium');
      cy.get('input[name="address"]').type('123 Main St, Atlanta, GA 30309');
      cy.get('textarea[name="notes"]').type('This is a test organization created by Cypress.');
      
      // Submit the form
      cy.contains('button', 'Save').click();
      
      // Check organization was added to the list
      cy.contains(testName).should('be.visible');
      cy.contains('Technology').should('be.visible');
    });
  
    it('should edit an existing organization', () => {
      // Get first organization in the list
      cy.get('tbody tr').first().within(() => {
        cy.contains('Edit').click();
      });
      
      // Check edit form appears
      cy.contains('h3', 'Edit Organization').should('be.visible');
      
      // Update organization information
      cy.get('input[name="industry"]').clear().type('Updated Industry');
      cy.get('select[name="size"]').select('large');
      
      // Save changes
      cy.contains('button', 'Update').click();
      
      // Verify changes appear in the list
      cy.contains('Updated Industry').should('be.visible');
      cy.contains('Large (500+)').should('be.visible');
    });
  
    it('should delete an organization', () => {
      // Store the number of organizations before deletion
      cy.get('tbody tr').then($rows => {
        const initialCount = $rows.length;
        
        // Get last organization (likely our test organization) and delete it
        cy.get('tbody tr').last().within(() => {
          cy.contains('Delete').click();
        });
        
        // Handle the confirmation dialog
        cy.on('window:confirm', () => true);
        
        // Wait for deletion to complete
        cy.wait(1000);
        
        // Verify one less organization in the list
        cy.get('tbody tr').should('have.length', initialCount - 1);
      });
    });
  });