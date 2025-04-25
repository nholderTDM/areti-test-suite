describe('Responsive Design Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  // Test desktop viewport
  it('should display correctly on large desktop screens', () => {
    cy.setViewportAndTest(1920, 1080, 'nav ul', true);
    cy.setViewportAndTest(1920, 1080, '#hamburger', false);
    
    // Check hero section layout
    cy.get('.hero h2').should('have.css', 'font-size').and('match', /4[0-9]px|5[0-9]px/);
    
    // Check features layout
    cy.get('.features').then($features => {
      const displayStyle = window.getComputedStyle($features[0]).getPropertyValue('display');
      expect(displayStyle).to.match(/grid|flex/);
    });
    
    cy.screenshot('responsive-desktop');
  });

  // Test tablet viewport
  it('should display correctly on tablet screens', () => {
    cy.setViewportAndTest(768, 1024, 'nav ul', true);
    cy.setViewportAndTest(768, 1024, '#hamburger', true);
    
    // Check hero section layout
    cy.get('.hero h2').should('have.css', 'font-size').and('match', /3[0-9]px|4[0-9]px/);
    
    cy.screenshot('responsive-tablet');
  });

  // Test mobile viewport
  it('should display correctly on mobile screens', () => {
    cy.setViewportAndTest(375, 667, 'nav', false); // Nav should be hidden initially
    cy.setViewportAndTest(375, 667, '#hamburger', true); // Hamburger should be visible
    
    // Check mobile menu functionality
    cy.get('#hamburger').click();
    cy.get('nav.show').should('be.visible');
    
    // Check hero section layout
    cy.get('.hero h2').should('have.css', 'font-size').and('match', /2[0-9]px|3[0-9]px/);
    
    cy.screenshot('responsive-mobile');
  });

  // Test different sections' responsiveness
  it('should have responsive contact section form', () => {
    cy.navigateToWebsiteSection('contact');
    
    // Test on desktop
    cy.viewport(1280, 800);
    cy.get('.contact-form').should('be.visible');
    cy.screenshot('contact-form-desktop');
    
    // Test on mobile
    cy.viewport(375, 667);
    cy.get('.contact-form').should('be.visible');
    cy.screenshot('contact-form-mobile');
  });
});