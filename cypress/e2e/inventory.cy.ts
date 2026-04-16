import { InventoryPage } from '../support/pages/InventoryPage';

describe('Inventory Page', () => {
  const inventoryPage = new InventoryPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
  });

  it('should display 6 inventory items', () => {
    inventoryPage.expectItemCount(6);
  });

  it('should add item to cart and show badge count', () => {
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.expectCartBadge(1);
  });

  it('should add multiple items and update badge', () => {
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.addItemToCart('Sauce Labs Bike Light');
    inventoryPage.expectCartBadge(2);
  });

  it('should remove item from cart on inventory page', () => {
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.expectCartBadge(1);
    inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    inventoryPage.expectCartBadgeNotVisible();
  });

  it('should sort items A to Z', () => {
    inventoryPage.sortBy('az');
    inventoryPage.getItemNames().then((names) => {
      const sorted = [...names].sort();
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should sort items Z to A', () => {
    inventoryPage.sortBy('za');
    inventoryPage.getItemNames().then((names) => {
      const sorted = [...names].sort().reverse();
      expect(names).to.deep.equal(sorted);
    });
  });

  it('should log out successfully', () => {
    inventoryPage.logout();
    cy.url().should('match', /saucedemo\.com\/?$/);
  });
});
