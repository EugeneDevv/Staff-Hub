///<reference types="cypress"/>

describe('Profile Form', () => {
    beforeEach(() => {
      const email = 'sandra.chege@griffinglobaltech.com';
      const password = 'Dubai@001'; 
      cy.visit('http://localhost:5173/login');
  
      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);
  
      cy.get('form').submit(); 
  
      cy.visit('http://localhost:5173/complete-profile');      
    });
  
    it('should not submit an empty form', ()=>{
      cy.get('.submitButton').click()
    })
  
    it('Should fill profile form successfully', ()=>{
  
      //CONTACT DETAILS
      cy.get('input[name="firstName"]').type('Sandra');
      cy.get('input[name="lastName"]').type('Chege');
      cy.get('input[name="phoneNumber"]').type('254703298507');
  
      //EDUCATION DETAILS
      cy.get('input[name="areaOfStudy"]').type('Computer Science');
      cy.get('input[name="institution"]').type('University of Nairobi');
      cy.get('input[name="isContinuing"]').check();
      cy.get('.customDropdownWrapper').eq(0).click().contains('Masters').click();
  
      //JOB EXPERIENCE
      cy.get('input[name="jobTitle"]').type('Quality Analyst');
      cy.get('input[name="companyName"]').type('Griffin Global Tech');
      cy.get('input[name="startDate"]').eq(0).click().type('2024-03');
  
      //SKILLS
      //skillname
      cy.get('.customDropdownWrapper').eq(1).click().contains('Cypress').click();
      //proficiencylevel
      cy.get('.customDropdownWrapper').eq(2).click().contains('Intermediate').click();
  
  
      //CERTIFICATIONS
      cy.get('input[name="certificateName"]').type('Fundamentals of Test Rails');
      cy.get('input[name="issueDate"]').eq(0).click().type('2024-02');
      cy.get('input[name="issuer"]').type('Test Rails');
      cy.get('input[name="code"]').type('ABC345');
      cy.get('input[name="certificateLink"]').type('https://fundamentalsoftestrails/SandraChege');
  
      //PROJECTS
      cy.get('.customDropdownWrapper').eq(3).click().contains('Internal Project').click();
      cy.get('.customDropdownWrapper').eq(4).click().contains('Scrum Master').click();
      cy.get('input[name="startDate"]').eq(1).click().type('2024-03');
      cy.get('.customDropdownWrapper').eq(5).click().contains('GER').click();
  
      cy.get('.submitButton').click()
     
    })
  })