///<reference types="cypress"/>

describe('Login Page tests', () => {
    beforeEach(() => {
      cy.visit('http://localhost:5173/login');
    });

    it("checks the background color for the title and text", ()=>{
      cy.get('.titleSidebar')
      .should('have.css', 'background-color', 'rgb(123, 184, 58)')
    })

    it('checks text appearance and text color of G.E.R', () =>{
      cy.contains('h2.title', 'G.E.R')
        .should('have.css', 'color', 'rgb(255, 255, 255)')
    })

    it('checks text appearance and text color of Manage. Assign. Track', () =>{
      cy.contains('h4', 'Manage. Assign. Track')
        .should('have.css', 'color', 'rgb(255, 255, 255)')
    })

    it('checks text appearance and text color', () =>{
      cy.get('.onboardingForm > h2')
      .should('have.text', 'Login to G.E.R')
        .should('have.css', 'color', 'rgb(0, 0, 0)')
    })

    it('should display an error when email is empty', () =>{
      const password = 'Test@123';
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit();
    })

    it('should display an error when password is empty', () =>{
      const email = 'test@griffinglobaltech.com';
  
      cy.get('input[name="email"]').type(email).should('have.value', email);

      cy.get('form').submit();
    })

    it('should display an error when both password and email are empty', () =>{
      cy.get('form').submit();
    });
  
    it('should display error messages if email or password is invalid', () => {
      const email = 'invalidemail@griffinglobaltech.com';
      const password = 'InvalidPassword';

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit();

      cy.get('.Toastify__toast-body').should('contain.text', 'Invalid credentials');
    });

    it('should not login using incorrect email and correct password', () => {
      const email = 'testtest@griffinglobaltech.com';
      const password = 'Dubai@001';

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit();

      cy.visit('http://localhost:5173/home')
    });

    it('should not login using correct email and incorrect password', () => {
      const email = 'sandra.chege@griffinglobaltech.com';
      const password = 'Test@1234';

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit();

      cy.visit('http://localhost:5173/home')
    });

    it('should login using valid email and password', () => {
      const email = 'sandra.chege@griffinglobaltech.com';
      const password = 'Dubai@001';

      cy.get('input[name="email"]').type(email).should('have.value', email);
  
      cy.get('input[name="password"]').type(password).should('have.value', password);

      cy.get('form').submit();

      cy.visit('http://localhost:5173/home')
    });    
    
    it('should contain Forgot password link', ()=>{
      cy.get('.link').should('contain.text', 'Forgot Password');
    })

    it('Should redirect when one clicks on forgot password link', ()=>{
      cy.get('.link').click();

      cy.url().should('include','http://localhost:5173/reset-password')
    })

    it('Should redirect one to login page from forgot Password', ()=>{
      cy.get('.link').click();
      cy.url().should('include','http://localhost:5173/reset-password')

      cy.get('.link').click();
      cy.url().should('include','http://localhost:5173/login')
    })

    it('Should not accept an invalid email in forgot password', ()=>{
      const email = 'sandra.chege@griffinglobal.com';

      cy.visit('http://localhost:5173/login');
      cy.get('.link').click();

      cy.get('input[name="email"]').type(email).should('have.value', email);

      cy.get('.submitButton').click()
      // cy.url().should('include','http://localhost:5173/verify-otp')
    })

    it('Should not accept an incorrect email in forgot password', ()=>{
      const email = 'test@griffinglobaltech.com';

      cy.visit('http://localhost:5173/login');
      cy.get('.link').click();

      cy.get('input[name="email"]').type(email).should('have.value', email);

      cy.get('.submitButton').click()
      // cy.url().should('include','http://localhost:5173/verify-otp')
    })

    it('Should accept an correct email in forgot password', ()=>{
      const email = 'sandra.chege@griffinglobaltech.com';

      cy.visit('http://localhost:5173/login');
      cy.get('.link').click();

      cy.get('input[name="email"]').type(email).should('have.value', email);

      // cy.get('.submitButton').click()
      // cy.url().should('include','http://localhost:5173/verify-otp')
    })
});



