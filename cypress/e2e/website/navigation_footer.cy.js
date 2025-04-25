describe('Navigation and Footer Tests', () => {
    beforeEach(() => {
      cy.visit('/');
    });
  
    it('should have all main navigation items', () => {
      // Check all navigation items exist
      cy.get('nav ul li a').should('have.length.at.least', 4);
      
      // Check specific navigation items
      const navItems = ['Home', 'Services', 'Drivers', 'About', 'Contact'];
      navItems.forEach(item => {
        cy.get('nav ul li a').contains(item, { matchCase: false }).should('be.visible');
      });
    });
  
    it('should navigate to correct sections when clicking nav items', () => {
      // Test each navigation item
      const sections = ['home', 'services', 'drivers', 'about', 'contact'];
      
      sections.forEach(section => {
        cy.get(`a[href*="#${section}"]`).first().click();
        cy.get(`#${section}`).should('be.visible');
      });
    });
  
    it('should have functional mobile menu', () => {
      // Set mobile viewport
      cy.viewport(375, 667);
      
      // Check hamburger menu
      cy.get('#hamburger').should('be.visible');
      cy.get('nav').should('not.be.visible');
      
      // Open mobile menu
      cy.get('#hamburger').click();
      cy.get('nav.show').should('be.visible');
      
      // Test navigation in mobile menu
      cy.get('nav.show ul li a').contains('Contact', { matchCase: false }).click();
      cy.get('#contact').should('be.visible');
    });
  
    it('should have proper footer with all sections', () => {
      // Check footer exists
      cy.get('footer').should('be.visible');
      
      // Check footer columns
      cy.get('.footer-column').should('have.length.at.least', 3);
      
      // Check footer logo
      cy.get('.footer-logo').should('be.visible');
      
      // Check quick links section
      cy.get('.footer-column').contains('Quick Links', { matchCase: false }).should('be.visible');
      cy.get('.footer-column').contains('Quick Links', { matchCase: false }).parent().find('li a').should('have.length.at.least', 3);
      
      // Check contact information
      cy.get('.footer-column').contains('Contact Us', { matchCase: false }).should('be.visible');
      
      // Check footer bottom copyright
      cy.get('.footer-bottom').should('contain.text', '2025');
      cy.get('.footer-bottom').should('contain.text', 'Areti Alliance');
    });
  
    it('should have working footer links', () => {
      // Test privacy policy link
      cy.get('footer').contains('Privacy Policy', { matchCase: false }).click();
      cy.url().should('include', 'privacy.html');
      
      // Go back and test terms link
      cy.go('back');
      cy.get('footer').contains('Terms of Service', { matchCase: false }).click();
      cy.url().should('include', 'terms.html');
    });
  });