describe('Homepage Tests', () => {
  beforeEach(() => {
    // Visit homepage before each test
    cy.visit('/');
  });

  it('should have correct title and meta information', () => {
    // Check page title
    cy.title().should('include', 'Areti Alliance');
    
    // Check meta description exists
    cy.get('meta[name="description"]').should('exist');
  });

  it('should have visible logo and navigation', () => {
    // Check logo is visible
    cy.get('.logo').should('be.visible');
    
    // Check main navigation is visible
    cy.get('nav ul').should('be.visible');
    cy.get('nav ul li').should('have.length.at.least', 4);
  });

  it('should navigate to all main sections', () => {
    // Test navigation to each main section
    const sections = ['home', 'services', 'drivers', 'about', 'contact'];
    
    sections.forEach(section => {
      cy.navigateToWebsiteSection(section);
      // Take screenshot of each section
      cy.screenshot(`homepage-${section}-section`);
    });
  });

  it('should have a functional hero section with CTA button', () => {
    // Check hero section content
    cy.get('.hero').within(() => {
      cy.get('h1, h2').should('be.visible');
      cy.get('p').should('be.visible');
      cy.get('.btn').should('be.visible').and('contain.text', 'Get a Quote');
    });
    
    // Test CTA button
    cy.get('#get-quote-btn').click();
    cy.get('.quote-calculator').should('be.visible');
  });

  it('should display features section properly', () => {
    // Check features section content
    cy.get('.features-section').should('exist');
    cy.get('.feature-card').should('have.length.at.least', 3);
    
    // Check first feature card content
    cy.get('.feature-card').first().within(() => {
      cy.get('.feature-icon').should('be.visible');
      cy.get('h3').should('be.visible');
      cy.get('p').should('be.visible');
    });
  });

  it('should show testimonials section', () => {
    // Check testimonials section
    cy.get('.testimonials').should('exist');
    cy.get('.testimonial-card').should('have.length.at.least', 1);
    
    // Check first testimonial content
    cy.get('.testimonial-card').first().within(() => {
      cy.get('.testimonial-content p').should('be.visible');
      cy.get('.testimonial-author').should('be.visible');
    });
  });
});