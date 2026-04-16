import { InventoryPage } from '../support/pages/InventoryPage';
import { CartPage } from '../support/pages/CartPage';

describe('Shopping Cart', () => {
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
  });

  it('should show added item in cart', () => {
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.expectItemInCart('Sauce Labs Backpack');
  });

  it('should remove item from cart page', () => {
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.removeItem('Sauce Labs Backpack');
    cartPage.expectCartEmpty();
  });

  it('should continue shopping from cart', () => {
    inventoryPage.goToCart();
    cartPage.continueShopping();
    cy.url().should('include', '/inventory');
  });
});
