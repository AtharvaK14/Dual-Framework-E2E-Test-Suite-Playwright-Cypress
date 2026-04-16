export class CheckoutPage {
  fillShippingInfo(firstName: string, lastName: string, zip: string) {
    if (firstName) cy.get('[data-test="firstName"]').type(firstName);
    if (lastName) cy.get('[data-test="lastName"]').type(lastName);
    if (zip) cy.get('[data-test="postalCode"]').type(zip);
  }

  continueToOverview() {
    cy.get('[data-test="continue"]').click();
  }

  finishOrder() {
    cy.get('[data-test="finish"]').click();
  }

  expectOrderComplete() {
    cy.get('.complete-header').should('have.text', 'Thank you for your order!');
  }

  expectCheckoutError(message: string) {
    cy.get('[data-test="error"]').should('contain', message);
  }

  getTotalPrice(): Cypress.Chainable<string> {
    return cy.get('.summary_total_label').invoke('text');
  }
}
