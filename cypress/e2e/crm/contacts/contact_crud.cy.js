describe('CRM Contacts Module - CRUD Operations', () => {
    beforeEach(() => {
      // Login and navigate to Contacts module
      cy.authenticateWithSso();
      cy.navigateToCrmModule('Contacts');
    });
  
    it('should display contacts list correctly', () => {
      // Check contacts header and buttons
      cy.contains('h2', 'Contacts').should('be.visible');
      cy.contains('button', 'Add Contact').should('be.visible');
      
      // Check if table exists (either with contacts or empty state)
      cy.get('.overflow-x-auto, .text-center.py-8').should('exist');
    });
  
    it('should open contact form when clicking Add Contact', () => {
      // Click Add Contact button
      cy.contains('button', 'Add Contact').click();
      
      // Check form appears
      cy.get('form').should('be.visible');
      cy.contains('h3', 'Add New Contact').should('be.visible');
      
      // Check all required form fields
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="phone"]').should('be.visible');
      cy.get('input[name="company"]').should('be.visible');
      cy.get('select[name="status"]').should('be.visible');
      cy.get('textarea[name="notes"]').should('be.visible');
    });
  
    it('should create a new contact successfully', () => {
      // Generate a unique email to avoid duplicates
      const timestamp = new Date().getTime();
      const testEmail = `test.user.${timestamp}@example.com`;
      
      // Click Add Contact button
      cy.contains('button', 'Add Contact').click();
      
      // Fill the form
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type(testEmail);
      cy.get('input[name="phone"]').type('555-123-4567');
      cy.get('input[name="company"]').type('Test Company');
      cy.get('select[name="status"]').select('customer');
      cy.get('textarea[name="notes"]').type('This is a test contact created by Cypress.');
      
      // Submit the form
      cy.contains('button', 'Save').click();
      
      // Check contact was added to the list
      cy.contains('Test User').should('be.visible');
      cy.contains(testEmail).should('be.visible');
    });
  
    it('should edit an existing contact', () => {
      // Get first contact in the list
      cy.get('tbody tr').first().within(() => {
        cy.contains('Edit').click();
      });
      
      // Check edit form appears
      cy.contains('h3', 'Edit Contact').should('be.visible');
      
      // Update contact information
      cy.get('input[name="company"]').clear().type('Updated Company Name');
      cy.get('select[name="status"]').select('partner');
      
      // Save changes
      cy.contains('button', 'Update').click();
      
      // Verify changes appear in the list
      cy.contains('Updated Company Name').should('be.visible');
      // Check for the partner status badge
      cy.get('.bg-purple-100').should('exist');
    });
  
    it('should delete a contact', () => {
      // Store the number of contacts before deletion
      cy.get('tbody tr').then($rows => {
        const initialCount = $rows.length;
        
        // Get last contact (likely our test contact) and delete it
        cy.get('tbody tr').last().within(() => {
          cy.contains('Delete').click();
        });
        
        // Handle the confirmation dialog
        cy.on('window:confirm', () => true);
        
        // Wait for deletion to complete
        cy.wait(1000);
        
        // Verify one less contact in the list
        cy.get('tbody tr').should('have.length', initialCount - 1);
      });
    });
  });