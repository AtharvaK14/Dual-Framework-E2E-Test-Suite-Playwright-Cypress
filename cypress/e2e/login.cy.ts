import { LoginPage } from '../support/pages/LoginPage';

describe('Login Functionality', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should log in successfully with valid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.username, users.validUser.password);
      loginPage.expectLoginSuccess();
    });
  });

  it('should show error for locked out user', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.lockedUser.username, users.lockedUser.password);
      loginPage.expectError('Sorry, this user has been locked out');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.invalidUser.username, users.invalidUser.password);
      loginPage.expectError('Username and password do not match');
    });
  });

  it('should show error when username is empty', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-test="password"]').type(users.validUser.password);
      cy.get('[data-test="login-button"]').click();
      loginPage.expectError('Username is required');
    });
  });

  it('should show error when password is empty', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-test="username"]').type(users.validUser.username);
      cy.get('[data-test="login-button"]').click();
      loginPage.expectError('Password is required');
    });
  });
});
