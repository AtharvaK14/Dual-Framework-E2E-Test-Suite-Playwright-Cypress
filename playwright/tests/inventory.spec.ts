import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import users from '../fixtures/users.json';

test.describe('Inventory Page', () => {
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);
    inventoryPage = new InventoryPage(page);
  });

  test('should display 6 inventory items', async () => {
    await inventoryPage.expectItemCount(6);
  });

  test('should add item to cart and show badge count', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
  });

  test('should add multiple items and update badge', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.addItemToCart('Sauce Labs Bike Light');
    await inventoryPage.expectCartBadge(2);
  });

  test('should remove item from cart on inventory page', async () => {
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.expectCartBadge(1);
    await inventoryPage.removeItemFromCart('Sauce Labs Backpack');
    await expect(inventoryPage.cartBadge).not.toBeVisible();
  });

  test('should sort items A to Z', async () => {
    await inventoryPage.sortBy('az');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  test('should sort items Z to A', async () => {
    await inventoryPage.sortBy('za');
    const names = await inventoryPage.getItemNames();
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  test('should sort items by price low to high', async () => {
    await inventoryPage.sortBy('lohi');
    const prices = await inventoryPage.page
      .locator('.inventory_item_price')
      .allInnerTexts();
    const numericPrices = prices.map(p => parseFloat(p.replace('$', '')));
    const sorted = [...numericPrices].sort((a, b) => a - b);
    expect(numericPrices).toEqual(sorted);
  });

  test('should log out successfully', async () => {
    await inventoryPage.logout();
    await expect(inventoryPage.page).toHaveURL(/saucedemo\.com\/?$/);
  });
});
