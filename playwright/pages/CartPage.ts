import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
  readonly page: Page;
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItems = page.locator('.cart_item');
    this.checkoutButton = page.locator('[data-test="checkout"]');
    this.continueShoppingButton = page.locator('[data-test="continue-shopping"]');
  }

  async expectItemInCart(itemName: string) {
    await expect(this.page.locator('.cart_item').filter({ hasText: itemName })).toBeVisible();
  }

  async expectCartEmpty() {
    await expect(this.cartItems).toHaveCount(0);
  }

  async removeItem(itemName: string) {
    const item = this.page.locator('.cart_item').filter({ hasText: itemName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
