export class CartPage {
  expectItemInCart(itemName: string) {
    cy.contains('.cart_item', itemName).should('be.visible');
  }

  expectCartEmpty() {
    cy.get('.cart_item').should('have.length', 0);
  }

  removeItem(itemName: string) {
    cy.contains('.cart_item', itemName)
      .find('button[data-test^="remove"]')
      .click();
  }

  proceedToCheckout() {
    cy.get('[data-test="checkout"]').click();
  }

  continueShopping() {
    cy.get('[data-test="continue-shopping"]').click();
  }
}
