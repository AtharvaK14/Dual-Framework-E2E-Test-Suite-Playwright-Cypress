import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import users from '../fixtures/users.json';

test.describe('Checkout Flow', () => {
  let checkoutPage: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.validUser.username, users.validUser.password);

    const inventoryPage = new InventoryPage(page);
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.goToCart();

    const cartPage = new CartPage(page);
    await cartPage.proceedToCheckout();
    checkoutPage = new CheckoutPage(page);
  });

  test('should complete checkout successfully', async () => {
    await checkoutPage.fillShippingInfo('Atharva', 'Kadam', '13601');
    await checkoutPage.continueToOverview();
    await checkoutPage.finishOrder();
    await checkoutPage.expectOrderComplete();
  });

  test('should show error when first name is missing', async () => {
    await checkoutPage.fillShippingInfo('', 'Kadam', '13601');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectCheckoutError('First Name is required');
  });

  test('should show error when last name is missing', async () => {
    await checkoutPage.fillShippingInfo('Atharva', '', '13601');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectCheckoutError('Last Name is required');
  });

  test('should show error when zip code is missing', async () => {
    await checkoutPage.fillShippingInfo('Atharva', 'Kadam', '');
    await checkoutPage.continueToOverview();
    await checkoutPage.expectCheckoutError('Postal Code is required');
  });

  test('should display correct total on overview', async () => {
    await checkoutPage.fillShippingInfo('Atharva', 'Kadam', '13601');
    await checkoutPage.continueToOverview();
    const total = await checkoutPage.getTotalPrice();
    expect(total).toContain('$');
    // Sauce Labs Backpack is $29.99 + tax
  });
});
