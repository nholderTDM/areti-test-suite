describe('CRM Tasks Module - CRUD Operations', () => {
    beforeEach(() => {
      // Login and navigate to Tasks module
      cy.authenticateWithSso();
      cy.navigateToCrmModule('Tasks');
    });
  
    it('should display tasks list correctly', () => {
      // Check tasks header and buttons
      cy.contains('h2', 'Tasks').should('be.visible');
      cy.contains('button', 'Add Task').should('be.visible');
      
      // Check if table exists (either with tasks or empty state)
      cy.get('.overflow-x-auto, .text-center.py-8').should('exist');
    });
  
    it('should open task form when clicking Add Task', () => {
      // Click Add Task button
      cy.contains('button', 'Add Task').click();
      
      // Check form appears
      cy.get('form').should('be.visible');
      cy.contains('h3', 'Add New Task').should('be.visible');
      
      // Check all required form fields
      cy.get('input[name="title"]').should('be.visible');
      cy.get('input[name="dueDate"]').should('be.visible');
      cy.get('select[name="priority"]').should('be.visible');
      cy.get('select[name="status"]').should('be.visible');
      cy.get('select[name="contactId"]').should('be.visible');
      cy.get('textarea[name="description"]').should('be.visible');
    });
  
    it('should create a new task successfully', () => {
      // Generate a unique title
      const timestamp = new Date().getTime();
      const testTitle = `Test Task ${timestamp}`;
      
      // Get tomorrow's date formatted as YYYY-MM-DD
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const formattedDate = tomorrow.toISOString().split('T')[0];
      
      // Click Add Task button
      cy.contains('button', 'Add Task').click();
      
      // Fill the form
      cy.get('input[name="title"]').type(testTitle);
      cy.get('input[name="dueDate"]').type(formattedDate);
      cy.get('select[name="priority"]').select('high');
      cy.get('select[name="status"]').select('pending');
      cy.get('textarea[name="description"]').type('This is a test task created by Cypress.');
      
      // Submit the form
      cy.contains('button', 'Save').click();
      
      // Check task was added to the list
      cy.contains(testTitle).should('be.visible');
      cy.get('.bg-red-100.text-red-800').should('be.visible'); // High priority badge
    });
  
    it('should mark a task as complete', () => {
      // Get first pending task in the list
      cy.get('tbody tr').first().within(() => {
        // Check if Complete button exists, if so click it
        cy.get('button').contains('Complete').then($btn => {
          if ($btn.length > 0) {
            cy.wrap($btn).click();
          } else {
            // If no Complete button, check if we can edit the task to set it to pending first
            cy.contains('Edit').click();
          }
        });
      });
      
      // If we had to edit the task to make it pending first
      cy.get('h3').then($header => {
        if ($header.text().includes('Edit Task')) {
          cy.get('select[name="status"]').select('pending');
          cy.contains('button', 'Update').click();
          
          // Now click Complete on the updated task
          cy.get('tbody tr').first().within(() => {
            cy.contains('Complete').click();
          });
        }
      });
      
      // Verify task is marked as completed - check for the green "Completed" badge
      cy.get('.bg-green-100.text-green-800').should('exist');
    });
  
    it('should edit an existing task', () => {
      // Get first task in the list
      cy.get('tbody tr').first().within(() => {
        cy.contains('Edit').click();
      });
      
      // Check edit form appears
      cy.contains('h3', 'Edit Task').should('be.visible');
      
      // Update task information
      cy.get('input[name="title"]').clear().type('Updated Task Title');
      cy.get('select[name="priority"]').select('medium');
      
      // Save changes
      cy.contains('button', 'Update').click();
      
      // Verify changes appear in the list
      cy.contains('Updated Task Title').should('be.visible');
    });
  
    it('should delete a task', () => {
      // Store the number of tasks before deletion
      cy.get('tbody tr').then($rows => {
        const initialCount = $rows.length;
        
        // Skip test if no tasks exist
        if (initialCount === 0) {
          cy.log('No tasks to delete - skipping test');
          return;
        }
        
        // Get last task and delete it
        cy.get('tbody tr').last().within(() => {
          cy.contains('Delete').click();
        });
        
        // Handle the confirmation dialog
        cy.on('window:confirm', () => true);
        
        // Wait for deletion to complete
        cy.wait(1000);
        
        // Verify one less task in the list
        cy.get('tbody tr').should('have.length', initialCount - 1);
      });
    });
  });