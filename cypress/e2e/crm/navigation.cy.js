describe('CRM Dashboard Navigation', () => {
    beforeEach(() => {
      // Login before each test
      cy.authenticateWithSso();
    });
  
    it('should have sidebar with all main modules', () => {
      // Check sidebar is visible
      cy.get('.bg-blue-800.text-white').should('be.visible');
      
      // Check all expected modules are present
      const expectedModules = [
        'Overview', 'Contacts', 'Organizations', 
        'Tasks', 'Drivers', 'Deliveries', 
        'Quotes', 'Revenue', 'Routes', 
        'Performance', 'Settings'
      ];
      
      expectedModules.forEach(module => {
        cy.get('.bg-blue-800.text-white').contains(module).should('be.visible');
      });
    });
  
    it('should navigate to all modules successfully', () => {
      // Test navigating to each module
      const modulesToTest = [
        'Overview', 'Contacts', 'Organizations', 
        'Tasks', 'Drivers', 'Deliveries', 
        'Quotes', 'Revenue', 'Routes', 
        'Performance', 'Settings'
      ];
      
      modulesToTest.forEach(module => {
        cy.navigateToCrmModule(module);
        cy.screenshot(`crm-${module.toLowerCase()}-module`);
      });
    });
  
    it('should toggle sidebar', () => {
      // Check default sidebar state
      cy.get('.w-64').should('be.visible');
      
      // Toggle sidebar
      cy.get('.nav-container button').first().click();
      
      // Check collapsed sidebar
      cy.get('.w-20').should('be.visible');
      
      // Toggle back
      cy.get('.nav-container button').first().click();
      
      // Check expanded sidebar
      cy.get('.w-64').should('be.visible');
    });
  
    it('should display user info in header', () => {
      // Check user avatar is displayed
      cy.get('.h-8.w-8.rounded-full').should('be.visible');
      
      // Check dark mode toggle button exists
      cy.get('button').find('svg').should('be.visible');
    });
  
    it('should toggle dark mode', () => {
      // Toggle dark mode
      cy.get('button').find('svg').click();
      
      // Check dark mode class is applied
      cy.get('.dark').should('exist');
      
      // Toggle back to light mode
      cy.get('button').find('svg').click();
      
      // Check dark mode class is removed
      cy.get('.dark').should('not.exist');
    });
  });