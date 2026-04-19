export class InventoryPage {
  addItemToCart(itemName: string) {
    cy.contains('.inventory_item', itemName)
      .find('button[data-test^="add-to-cart"]')
      .click();
  }

  removeItemFromCart(itemName: string) {
    cy.contains('.inventory_item', itemName)
      .find('button[data-test^="remove"]')
      .click();
  }

  goToCart() {
    cy.get('.shopping_cart_link').click();
  }

  sortBy(option: string) {
    cy.get('[data-test="product-sort-container"]').select(option);
  }

  getItemNames(): Cypress.Chainable<string[]> {
    return cy.get('.inventory_item_name').then($els =>
      Cypress._.map($els, 'innerText')
    );
  }

  expectItemCount(count: number) {
    cy.get('.inventory_item').should('have.length', count);
  }

  expectCartBadge(count: number) {
    cy.get('.shopping_cart_badge').should('have.text', String(count));
  }

  expectCartBadgeNotVisible() {
    cy.get('.shopping_cart_badge').should('not.exist');
  }

  logout() {
    cy.get('#react-burger-menu-btn').click();
    cy.get('#logout_sidebar_link').click();
  }
}
