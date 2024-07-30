///<reference types="cypress"/>

describe('Avatar actions', ()=>{
    beforeEach(() => {
      const email = 'sandra.chege@griffinglobaltech.com';
      const password = 'Dubai@001';

      cy.visit('http://localhost:5173/login'); 

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit(); 
      
      cy.url().should('include', 'http://localhost:5173/home')
    });

    it('should click on avatar', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
    })

    it('should view profile', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(0).click();
    }) 
    it('should logout', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(3).click();
    }) 
})

describe('Reset Password', ()=>{
    beforeEach(() => {
        const email = 'sandra.chege@griffinglobaltech.com';
        const password = 'Dubai@001';
  
        cy.visit('http://localhost:5173/login'); 
  
        cy.get('input[name="email"]').type(email).should('have.value', email);
    
        cy.get('input[name="password"]').type(password).should('have.value', password);
  
        cy.get('form').submit(); 
        
        cy.url().should('include', 'http://localhost:5173/home')
    });
  
    it('should click on reset password ', ()=>{
          cy.get('.avatar-container .avatar').click({force:true})
          cy.get('.menu ul li').eq(1).click()
    })
  
    it('should not submit empty form', ()=>{
          cy.get('.avatar-container .avatar').click({force:true})
          cy.get('.menu ul li').eq(1).click();
          cy.contains('Update Password').click()
    }) 

    it('not accept wrong current password', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(1).click();

        cy.get('.changePasswordDiv').eq(0).find('input[type="password"]').type('Test@1234')
        cy.get('.changePasswordDiv').eq(1).find('input[type="password"]').type('Dubai@1234')
        cy.get('.changePasswordDiv').eq(2).find('input[type="password"]').type('Dubai@1234')
        cy.contains('Update Password').click()
        cy.get('.error').should('be.visible').should('have.text', 'You entered a wrong password')
    })

    it('not accept same current password and new password', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(1).click();

        cy.get('.changePasswordDiv').eq(0).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(1).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(2).find('input[type="password"]').type('Dubai@001')
        cy.contains('Update Password').click()
        cy.get(':nth-child(1) > .input-wrapper > .error').should('be.visible').should('have.text', "Current password and new password can't be the same")
    })

    it('not accept password that do not match in new and confirm password', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(1).click();

        cy.get('.changePasswordDiv').eq(0).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(1).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(2).find('input[type="password"]').type('Dubai@002')
        cy.contains('Update Password').click()
        cy.get('.error').should('be.visible').should('have.text', "New Password and confirm password do not match!")
    }) 

    it('reset password successfully', ()=>{
        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(1).click();

        cy.get('.changePasswordDiv').eq(0).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(1).find('input[type="password"]').type('Dubai@002')
        cy.get('.changePasswordDiv').eq(2).find('input[type="password"]').type('Dubai@002')
        cy.contains('Update Password').click()

        cy.get('.menu ul li').eq(3).click();
        const email = 'sandra.chege@griffinglobaltech.com';
        const password = 'Dubai@002';
  
        cy.visit('http://localhost:5173/login'); 
  
        cy.get('input[name="email"]').type(email).should('have.value', email);
    
        cy.get('input[name="password"]').type(password).should('have.value', password);
  
        cy.get('form').submit(); 

        cy.get('.avatar-container .avatar').click({force:true})
        cy.get('.menu ul li').eq(1).click();

        cy.get('.changePasswordDiv').eq(0).find('input[type="password"]').type('Dubai@002')
        cy.get('.changePasswordDiv').eq(1).find('input[type="password"]').type('Dubai@001')
        cy.get('.changePasswordDiv').eq(2).find('input[type="password"]').type('Dubai@001')
        cy.contains('Update Password').click()
        
    }) 
    

})

// describe('Update Security Questions', ()=>{
//     // before(() => {
//     //   const email = 'sandra.chege@griffinglobaltech.com';
//     //   const password = 'Dubai@001';

//     //   cy.visit('http://localhost:5173/login'); 

//     //   cy.get('input[name="email"]').type(email).should('have.value', email);
  
//     //   cy.get('input[name="password"]').type(password).should('have.value', password);

//     //   cy.get('form').submit(); 
      
//     //   cy.url().should('include', 'http://localhost:5173/home')
//     // });

//     // it('should click on update security question ', ()=>{
//     //     cy.get('.avatar-container .avatar').click({force:true})
//     //     cy.get('.menu ul li').eq(2).click().get('.UpdateSecurityQuestion')
//     // })

//     // it('should not accept no security questions', ()=>{

//     // }) 
//     // it('should view answers to security question', ()=>{
        
//     // }) 
//     // it('should not accept less than 3 security questions', ()=>{

//     // }) 
//     // it('should update security questions', ()=>{

//     // }) 


// })