import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import users from '../fixtures/users.json';

test.describe('Shopping Cart', () => {
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
  });

  test('should show added item in cart', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.expectItemInCart('Sauce Labs Backpack');
  });

  test('should remove item from cart page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();
    await cartPage.removeItem('Sauce Labs Backpack');
    await cartPage.expectCartEmpty();
  });

  test('should continue shopping from cart', async ({ page }) => {
    await inventoryPage.goToCart();
    await cartPage.continueShopping();
    await page.waitForURL(/inventory/);
  });

  test('should persist cart items after logout and login', async ({ page }) => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.logout();

    const loginPage = new LoginPage(page);
    await loginPage.login(users.validUser.username, users.validUser.password);

    inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    // SauceDemo does NOT persist cart across sessions
    await cartPage.expectCartEmpty();
  });
});
