export class LoginPage {
  visit() {
    cy.visit('/');
  }

  fillUsername(username: string) {
    cy.get('[data-test="username"]').clear().type(username);
  }

  fillPassword(password: string) {
    cy.get('[data-test="password"]').clear().type(password);
  }

  clickLogin() {
    cy.get('[data-test="login-button"]').click();
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  expectError(message: string) {
    cy.get('[data-test="error"]').should('be.visible').and('contain', message);
  }

  expectLoginSuccess() {
    cy.url().should('include', '/inventory');
  }
}
