///<reference types="cypress"/>

describe('Add a new user', ()=>{
    beforeEach(() => {
      const email = 'sandra.chege@griffinglobaltech.com';
      const password = 'Dubai@001';

      cy.visit('http://localhost:5173/login'); 

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit(); 
      
    });

    it('should not submit an empty form', ()=>{
        cy.get('.normalButton').click()
        cy.get('.addEmployee').click()
    })

    it('should not accept an invalid email', ()=>{
        const email = 'sandra.chege@griffin.com';

        cy.get('.normalButton').click()

        cy.get('#Email').type(email).should('have.value', 'sandra.chege@griffin.com');
        cy.get('.addEmployee').click()
    })

    it('should not add a user with an exisitng email', ()=>{
        const email = 'sandra.chege@griffinglobaltech.com';

        cy.get('.normalButton').click()
        
        cy.get('#Email').type(email).should('have.value', 'sandra.chege@griffinglobaltech.com');
        cy.get('.addEmployee').click()
    })

    it('should successfully add a user of type admin', ()=>{
        const email = 'jane.doe@griffinglobaltech.com';
        cy.get('.normalButton').click()
        
        cy.get('#Email').type(email).should('have.value', 'jane.doe@griffinglobaltech.com');
        cy.get('.contDetSec').eq(1).find('[id = "First Name"]').should('exist').type('Jane')
        cy.get('.contDetSec').eq(1).find('[id = "Last Name"]').should('exist').type('Doe')
        cy.get('.contDetSec').eq(2).get('.selectOpts').select('3') //Client Name
        cy.get('.contDetSec').eq(2).find('select').eq(1).select('3')// Role
        cy.get('.contDetSec').eq(3).find('select').eq(0).select('3')// Project Name
        cy.get('.contDetSec').eq(4).get('.outerCircle').eq(0).click()
        cy.get('.addEmployee').click()
    })  

    it('should successfully add a user of type employee', ()=>{
        const email = 'john.doe@griffinglobaltech.com';
        cy.get('.normalButton').click()
        
        cy.get('#Email').type(email).should('have.value', 'john.doe@griffinglobaltech.com');
        cy.get('.contDetSec').eq(1).find('[id = "First Name"]').should('exist').type('John')
        cy.get('.contDetSec').eq(1).find('[id = "Last Name"]').should('exist').type('Doe')
        cy.get('.contDetSec').eq(2).get('.selectOpts').select('2') //Client Name
        cy.get('.contDetSec').eq(2).find('select').eq(1).select('1')// Role
        cy.get('.contDetSec').eq(3).find('select').eq(0).select('7')// Project Name
        cy.get('.contDetSec').eq(4).get('.outerCircle').eq(1).click()
        cy.get('.addEmployee').click()
    })  
})

describe('Ellipsis actions', ()=>{
    beforeEach(() => {
        const email = 'sandra.chege@griffinglobaltech.com';
        const password = 'Dubai@001';
  
        cy.visit('http://localhost:5173/login'); 
  
        cy.get('input[name="email"]').type(email).should('have.value', email);
    
        cy.get('input[name="password"]').type(password).should('have.value', password);
  
        cy.get('form').submit(); 
    });

    it('should view user profile', ()=>{
       cy.get('.employeeItem').eq(5).get('.moreIcon').eq(0).click().get('ul li').eq(0).click()
    })  
    it('should suspend a user', ()=>{
        cy.get('.employeeItem').eq(5).get('.moreIcon').eq(0).click().get('ul li').eq(1).click()
        cy.get('.password-input').get('[name="reason"]').type('Indiscipline and tardiness')
        cy.get('.addSkillBtns').find('button').eq(0).click()
    })
    it('should unsususpend a user', ()=>{
        cy.get('.employeeItem').eq(5).get('.moreIcon').eq(0).click().get('ul li').eq(1).click()
    })
    
    it('should cancel delete a user', ()=>{
        cy.get('.employeeItem').eq(5).get('.moreIcon').eq(0).click().get('ul li').eq(2).click()
        cy.get('.addSkillBtns').find('button').eq(1).click({force:true})
    })

    it('should successfully delete a user', ()=>{
        cy.get('.employeeItem').eq(5).get('.moreIcon').eq(0).click().get('ul li').eq(2).click()
        cy.get(':nth-child(6) > .modal > .modal-content > .addSkill > .addSkillBtns > .add-skill').click()
    })
})

describe('search and filter options', ()=>{
    beforeEach(() => {
        const email = 'sandra.chege@griffinglobaltech.com';
        const password = 'Dubai@001';
  
        cy.visit('http://localhost:5173/login'); 
  
        cy.get('input[name="email"]').type(email).should('have.value', email);
    
        cy.get('input[name="password"]').type(password).should('have.value', password);
  
        cy.get('form').submit(); 
    });

    it('should check count', ()=>{
        cy.get('.topBar .employeeCount .description').should('contain.text', 'Total Employees')
        cy.get('.topBar .employeeCount .count').should('exist');
    })
    // it('should search for a user', ()=>{

    // })
    // it('should Filter by project', ()=>{

    // })
    // it('should Filter by role', ()=>{

    // })
    // it('should Filter by skill', ()=>{

    // })
    // it('should Filter by certificate', ()=>{

    // })
})






