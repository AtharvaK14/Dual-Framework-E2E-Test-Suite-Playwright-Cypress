/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
});

export {};
