import { type Page, type Locator, expect } from '@playwright/test';

export class CheckoutPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly zipCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly errorMessage: Locator;
  readonly completeHeader: Locator;
  readonly summaryTotal: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('[data-test="firstName"]');
    this.lastNameInput = page.locator('[data-test="lastName"]');
    this.zipCodeInput = page.locator('[data-test="postalCode"]');
    this.continueButton = page.locator('[data-test="continue"]');
    this.finishButton = page.locator('[data-test="finish"]');
    this.cancelButton = page.locator('[data-test="cancel"]');
    this.errorMessage = page.locator('[data-test="error"]');
    this.completeHeader = page.locator('.complete-header');
    this.summaryTotal = page.locator('.summary_total_label');
  }

  async fillShippingInfo(firstName: string, lastName: string, zip: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.zipCodeInput.fill(zip);
  }

  async continueToOverview() {
    await this.continueButton.click();
  }

  async finishOrder() {
    await this.finishButton.click();
  }

  async expectOrderComplete() {
    await expect(this.completeHeader).toHaveText('Thank you for your order!');
  }

  async expectCheckoutError(message: string) {
    await expect(this.errorMessage).toContainText(message);
  }

  async getTotalPrice(): Promise<string> {
    return await this.summaryTotal.innerText();
  }
}
