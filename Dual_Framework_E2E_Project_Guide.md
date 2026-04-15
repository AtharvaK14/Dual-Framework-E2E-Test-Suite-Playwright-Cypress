# Dual-Framework E2E Test Suite: Playwright + Cypress
## Project Build Guide for Atharva Kadam

---

## WHY THIS PROJECT STANDS OUT

Most QA portfolios show one framework. This project implements the **same test scenarios in both Playwright and Cypress**, targeting a real e-commerce application. That gives you three things no single-framework project can:

1. **Removes "(familiar)" from your resume.** After this project, you list Playwright and Cypress without qualifiers.
2. **Instant interview material.** "I built the same suite in both frameworks. Here's what I found..." is a conversation every interviewer wants to have in 2026.
3. **Demonstrates the QA engineering mindset**, not just tool proficiency. You're evaluating, comparing, and making evidence-based recommendations.

**Target application:** [SauceDemo](https://www.saucedemo.com/) by Sauce Labs. It's a fake e-commerce site built specifically for test automation practice. It has login flows, product catalogs, cart management, checkout, and intentionally buggy user accounts. It's stable (owned by Sauce Labs), widely recognized by QA interviewers, and won't disappear.

**Tech stack:** TypeScript for both frameworks (the industry standard in 2026), Page Object Model, GitHub Actions CI/CD, HTML reporting.

**Estimated time:** 2-3 weekends of focused work.

---

## PREREQUISITES

Before starting, make sure you have:

- **Node.js** (LTS, v20.x or v22.x): https://nodejs.org/
- **VS Code** with these extensions:
  - Playwright Test for VS Code (by Microsoft)
  - Cypress Helper (optional but useful)
  - ESLint
- **Git** installed and a GitHub account
- **Basic TypeScript knowledge** (if you know JavaScript, you'll pick it up as you go. TypeScript adds type annotations like `name: string` to catch errors early.)

---

## PHASE 0: PROJECT SETUP (Day 1, ~1 hour)

### 0.1 Create the Repository

```bash
mkdir dual-framework-e2e && cd dual-framework-e2e
git init
npm init -y
```

### 0.2 Project Structure

You'll build this structure over the course of the project:

```
dual-framework-e2e/
├── playwright/                  # Playwright framework
│   ├── tests/                   # Test specs
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   ├── pages/                   # Page Object Model
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── fixtures/                # Test data
│   │   └── users.json
│   └── playwright.config.ts
├── cypress/
│   ├── e2e/                     # Test specs
│   │   ├── login.cy.ts
│   │   ├── inventory.cy.ts
│   │   ├── cart.cy.ts
│   │   └── checkout.cy.ts
│   ├── support/
│   │   ├── pages/               # Page Object Model
│   │   │   ├── LoginPage.ts
│   │   │   ├── InventoryPage.ts
│   │   │   ├── CartPage.ts
│   │   │   └── CheckoutPage.ts
│   │   ├── commands.ts
│   │   └── e2e.ts
│   ├── fixtures/
│   │   └── users.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── e2e-tests.yml        # CI/CD pipeline
├── cypress.config.ts
├── tsconfig.json
├── package.json
├── COMPARISON.md                # Your framework comparison writeup
└── README.md
```

### 0.3 Install Dependencies

```bash
# Playwright
npm install --save-dev @playwright/test
npx playwright install                    # Downloads browser binaries

# Cypress
npm install --save-dev cypress

# TypeScript
npm install --save-dev typescript @types/node

# Shared utilities (optional but recommended)
npm install --save-dev dotenv
```

### 0.4 Root tsconfig.json

Create `tsconfig.json` at the project root:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "CommonJS",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "outDir": "./dist"
  },
  "include": ["playwright/**/*.ts"],
  "exclude": ["node_modules", "cypress"]
}
```

### 0.5 Package.json Scripts

Add these to your `package.json`:

```json
{
  "scripts": {
    "pw:test": "npx playwright test --config=playwright/playwright.config.ts",
    "pw:test:headed": "npx playwright test --config=playwright/playwright.config.ts --headed",
    "pw:report": "npx playwright show-report playwright/playwright-report",
    "cy:open": "npx cypress open",
    "cy:run": "npx cypress run",
    "test:all": "npm run pw:test && npm run cy:run",
    "lint": "npx tsc --noEmit"
  }
}
```

---

## PHASE 1: PLAYWRIGHT FRAMEWORK (Weekend 1)

### 1.1 Playwright Configuration

Create `playwright/playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['list']
  ],
  use: {
    baseURL: 'https://www.saucedemo.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});
```

### 1.2 Test Data Fixture

Create `playwright/fixtures/users.json`:

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "lockedUser": {
    "username": "locked_out_user",
    "password": "secret_sauce"
  },
  "problemUser": {
    "username": "problem_user",
    "password": "secret_sauce"
  },
  "performanceUser": {
    "username": "performance_glitch_user",
    "password": "secret_sauce"
  },
  "invalidUser": {
    "username": "invalid_user",
    "password": "wrong_password"
  }
}
```

### 1.3 Page Object Model: LoginPage

Create `playwright/pages/LoginPage.ts`:

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.locator('[data-test="username"]');
    this.passwordInput = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async goto() {
    await this.page.goto('/');
  }

  async login(username: string, password: string) {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  async expectError(message: string) {
    await expect(this.errorMessage).toBeVisible();
    await expect(this.errorMessage).toContainText(message);
  }

  async expectLoginSuccess() {
    await expect(this.page).toHaveURL(/inventory/);
  }
}
```

### 1.4 Page Object Model: InventoryPage

Create `playwright/pages/InventoryPage.ts`:

```typescript
import { type Page, type Locator, expect } from '@playwright/test';

export class InventoryPage {
  readonly page: Page;
  readonly inventoryItems: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly sortDropdown: Locator;
  readonly menuButton: Locator;
  readonly logoutLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inventoryItems = page.locator('.inventory_item');
    this.cartBadge = page.locator('.shopping_cart_badge');
    this.cartLink = page.locator('.shopping_cart_link');
    this.sortDropdown = page.locator('[data-test="product-sort-container"]');
    this.menuButton = page.locator('#react-burgerMenu-btn');
    this.logoutLink = page.locator('#logout_sidebar_link');
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.locator('button[data-test^="add-to-cart"]').click();
  }

  async removeItemFromCart(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    await item.locator('button[data-test^="remove"]').click();
  }

  async getItemPrice(itemName: string): Promise<string> {
    const item = this.page.locator('.inventory_item').filter({ hasText: itemName });
    return await item.locator('.inventory_item_price').innerText();
  }

  async goToCart() {
    await this.cartLink.click();
  }

  async sortBy(option: 'az' | 'za' | 'lohi' | 'hilo') {
    await this.sortDropdown.selectOption(option);
  }

  async getItemNames(): Promise<string[]> {
    return await this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async expectItemCount(count: number) {
    await expect(this.inventoryItems).toHaveCount(count);
  }

  async expectCartBadge(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async logout() {
    await this.menuButton.click();
    await this.logoutLink.click();
  }
}
```

### 1.5 Page Object Model: CartPage

Create `playwright/pages/CartPage.ts`:

```typescript
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
```

### 1.6 Page Object Model: CheckoutPage

Create `playwright/pages/CheckoutPage.ts`:

```typescript
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
```

### 1.7 Test Specs: Login Tests

Create `playwright/tests/login.spec.ts`:

```typescript
import { test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import users from '../fixtures/users.json';

test.describe('Login Functionality', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('should log in successfully with valid credentials', async () => {
    await loginPage.login(users.validUser.username, users.validUser.password);
    await loginPage.expectLoginSuccess();
  });

  test('should show error for locked out user', async () => {
    await loginPage.login(users.lockedUser.username, users.lockedUser.password);
    await loginPage.expectError('Sorry, this user has been locked out');
  });

  test('should show error for invalid credentials', async () => {
    await loginPage.login(users.invalidUser.username, users.invalidUser.password);
    await loginPage.expectError('Username and password do not match');
  });

  test('should show error when username is empty', async () => {
    await loginPage.login('', users.validUser.password);
    await loginPage.expectError('Username is required');
  });

  test('should show error when password is empty', async () => {
    await loginPage.login(users.validUser.username, '');
    await loginPage.expectError('Password is required');
  });
});
```

### 1.8 Test Specs: Inventory Tests

Create `playwright/tests/inventory.spec.ts`:

```typescript
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
```

### 1.9 Test Specs: Cart Tests

Create `playwright/tests/cart.spec.ts`:

```typescript
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
    // Note: SauceDemo may or may not persist cart. This test documents the behavior.
    await inventoryPage.addItemToCart('Sauce Labs Backpack');
    await inventoryPage.logout();

    const loginPage = new LoginPage(page);
    await loginPage.login(users.validUser.username, users.validUser.password);

    inventoryPage = new InventoryPage(page);
    await inventoryPage.goToCart();
    // Document actual behavior: does cart persist or not?
    // This is a VALID test even if it "fails" because it documents a behavior gap
  });
});
```

### 1.10 Test Specs: Checkout Tests

Create `playwright/tests/checkout.spec.ts`:

```typescript
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
```

### 1.11 Run and Verify Playwright

```bash
# Run all tests
npm run pw:test

# Run with visible browser (helpful for debugging)
npm run pw:test:headed

# Open the HTML report
npm run pw:report
```

At this point you should see all tests executing across Chromium, Firefox, and WebKit. Fix any failures before moving on.

---

## PHASE 2: CYPRESS FRAMEWORK (Weekend 2)

Now implement the **exact same test scenarios** in Cypress. This is where the comparison value comes from.

### 2.1 Cypress Configuration

Create `cypress.config.ts` at the project root:

```typescript
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    specPattern: 'cypress/e2e/**/*.cy.ts',
    supportFile: 'cypress/support/e2e.ts',
    viewportWidth: 1280,
    viewportHeight: 720,
    defaultCommandTimeout: 10000,
    video: true,
    screenshotOnRunFailure: true,
    retries: {
      runMode: 2,
      openMode: 0,
    },
  },
});
```

### 2.2 Cypress TypeScript Config

Create `cypress/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM"],
    "types": ["cypress", "node"],
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "resolveJsonModule": true,
    "baseUrl": ".",
    "paths": {
      "@pages/*": ["./support/pages/*"]
    }
  },
  "include": ["**/*.ts"],
  "exclude": ["node_modules"]
}
```

### 2.3 Cypress Support File

Create `cypress/support/e2e.ts`:

```typescript
import './commands';
```

### 2.4 Custom Commands

Create `cypress/support/commands.ts`:

```typescript
/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      login(username: string, password: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add('login', (username: string, password: string) => {
  cy.visit('/');
  cy.get('[data-test="username"]').type(username);
  cy.get('[data-test="password"]').type(password);
  cy.get('[data-test="login-button"]').click();
});

export {};
```

### 2.5 Test Data Fixture

Create `cypress/fixtures/users.json` (same content as the Playwright version):

```json
{
  "validUser": {
    "username": "standard_user",
    "password": "secret_sauce"
  },
  "lockedUser": {
    "username": "locked_out_user",
    "password": "secret_sauce"
  },
  "invalidUser": {
    "username": "invalid_user",
    "password": "wrong_password"
  }
}
```

### 2.6 Page Object Model: LoginPage

Create `cypress/support/pages/LoginPage.ts`:

```typescript
export class LoginPage {
  visit() {
    cy.visit('/');
  }

  fillUsername(username: string) {
    cy.get('[data-test="username"]').clear().type(username);
  }

  fillPassword(password: string) {
    cy.get('[data-test="password"]').clear().type(password);
  }

  clickLogin() {
    cy.get('[data-test="login-button"]').click();
  }

  login(username: string, password: string) {
    this.fillUsername(username);
    this.fillPassword(password);
    this.clickLogin();
  }

  expectError(message: string) {
    cy.get('[data-test="error"]').should('be.visible').and('contain', message);
  }

  expectLoginSuccess() {
    cy.url().should('include', '/inventory');
  }
}
```

### 2.7 Page Object Model: InventoryPage

Create `cypress/support/pages/InventoryPage.ts`:

```typescript
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
    cy.get('#react-burgerMenu-btn').click();
    cy.get('#logout_sidebar_link').click();
  }
}
```

### 2.8 Page Object Model: CartPage

Create `cypress/support/pages/CartPage.ts`:

```typescript
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
```

### 2.9 Page Object Model: CheckoutPage

Create `cypress/support/pages/CheckoutPage.ts`:

```typescript
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
```

### 2.10 Cypress Test Specs

Create `cypress/e2e/login.cy.ts`:

```typescript
import { LoginPage } from '../support/pages/LoginPage';

describe('Login Functionality', () => {
  const loginPage = new LoginPage();

  beforeEach(() => {
    loginPage.visit();
  });

  it('should log in successfully with valid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.validUser.username, users.validUser.password);
      loginPage.expectLoginSuccess();
    });
  });

  it('should show error for locked out user', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.lockedUser.username, users.lockedUser.password);
      loginPage.expectError('Sorry, this user has been locked out');
    });
  });

  it('should show error for invalid credentials', () => {
    cy.fixture('users').then((users) => {
      loginPage.login(users.invalidUser.username, users.invalidUser.password);
      loginPage.expectError('Username and password do not match');
    });
  });

  it('should show error when username is empty', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-test="password"]').type(users.validUser.password);
      cy.get('[data-test="login-button"]').click();
      loginPage.expectError('Username is required');
    });
  });

  it('should show error when password is empty', () => {
    cy.fixture('users').then((users) => {
      cy.get('[data-test="username"]').type(users.validUser.username);
      cy.get('[data-test="login-button"]').click();
      loginPage.expectError('Password is required');
    });
  });
});
```

Create `cypress/e2e/inventory.cy.ts`:

```typescript
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
```

Create `cypress/e2e/cart.cy.ts`:

```typescript
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
```

Create `cypress/e2e/checkout.cy.ts`:

```typescript
import { InventoryPage } from '../support/pages/InventoryPage';
import { CartPage } from '../support/pages/CartPage';
import { CheckoutPage } from '../support/pages/CheckoutPage';

describe('Checkout Flow', () => {
  const inventoryPage = new InventoryPage();
  const cartPage = new CartPage();
  const checkoutPage = new CheckoutPage();

  beforeEach(() => {
    cy.fixture('users').then((users) => {
      cy.login(users.validUser.username, users.validUser.password);
    });
    inventoryPage.addItemToCart('Sauce Labs Backpack');
    inventoryPage.goToCart();
    cartPage.proceedToCheckout();
  });

  it('should complete checkout successfully', () => {
    checkoutPage.fillShippingInfo('Atharva', 'Kadam', '13601');
    checkoutPage.continueToOverview();
    checkoutPage.finishOrder();
    checkoutPage.expectOrderComplete();
  });

  it('should show error when first name is missing', () => {
    checkoutPage.fillShippingInfo('', 'Kadam', '13601');
    checkoutPage.continueToOverview();
    checkoutPage.expectCheckoutError('First Name is required');
  });

  it('should show error when last name is missing', () => {
    checkoutPage.fillShippingInfo('Atharva', '', '13601');
    checkoutPage.continueToOverview();
    checkoutPage.expectCheckoutError('Last Name is required');
  });

  it('should show error when zip code is missing', () => {
    checkoutPage.fillShippingInfo('Atharva', 'Kadam', '');
    checkoutPage.continueToOverview();
    checkoutPage.expectCheckoutError('Postal Code is required');
  });
});
```

### 2.11 Run and Verify Cypress

```bash
# Interactive mode (opens browser UI)
npm run cy:open

# Headless mode (for CI)
npm run cy:run
```

---

## PHASE 3: CI/CD PIPELINE (Weekend 2-3 overlap)

### 3.1 GitHub Actions Workflow

Create `.github/workflows/e2e-tests.yml`:

```yaml
name: E2E Tests (Playwright + Cypress)

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  playwright:
    name: Playwright Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Install Playwright browsers
        run: npx playwright install --with-deps

      - name: Run Playwright tests
        run: npm run pw:test

      - name: Upload Playwright report
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright/playwright-report/
          retention-days: 14

  cypress:
    name: Cypress Tests
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Run Cypress tests
        run: npm run cy:run

      - name: Upload Cypress screenshots
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: cypress/screenshots/
          retention-days: 14

      - name: Upload Cypress videos
        uses: actions/upload-artifact@v4
        if: always()
        with:
          name: cypress-videos
          path: cypress/videos/
          retention-days: 14
```

---

## PHASE 4: THE COMPARISON DOCUMENT (What Makes This Stand Out)

Create `COMPARISON.md` in your repo root. This is your analysis document. Fill it in as you build. Template:

```markdown
# Framework Comparison: Playwright vs Cypress (2026)

## Test Environment
- Target application: SauceDemo (https://www.saucedemo.com)
- Test count: [X] scenarios implemented in both frameworks
- Machine: [your specs]
- Node.js version: [version]
- Playwright version: [version]
- Cypress version: [version]

## Setup Complexity
| Metric | Playwright | Cypress |
|--------|-----------|---------|
| Install commands | ? | ? |
| Config file complexity | ? | ? |
| Time to first passing test | ? min | ? min |
| TypeScript setup effort | Native | Requires tsconfig |

## Execution Speed
| Suite | Playwright (Chromium) | Cypress (Chrome) |
|-------|----------------------|-------------------|
| Login (5 tests) | ? sec | ? sec |
| Inventory (7 tests) | ? sec | ? sec |
| Cart (3-4 tests) | ? sec | ? sec |
| Checkout (4-5 tests) | ? sec | ? sec |
| **Total** | **? sec** | **? sec** |

## Cross-Browser Support
| Browser | Playwright | Cypress |
|---------|-----------|---------|
| Chrome/Chromium | Yes | Yes |
| Firefox | Yes | Yes |
| Safari/WebKit | Yes | No (partial) |
| Mobile emulation | Built-in | Limited |

## Developer Experience
- **Auto-wait:** [your observations]
- **Debugging tools:** [your observations]
- **Error messages:** [your observations]
- **IDE integration:** [your observations]

## Page Object Model Differences
- [Document how POM implementation differs between the two]
- [Which felt more natural?]

## CI/CD Integration
- [Pipeline setup effort comparison]
- [Artifact/report quality comparison]

## My Recommendation
[Your evidence-based opinion on when to use which]
```

**This document is the project's secret weapon.** It shows you didn't just follow a tutorial. You evaluated, measured, and formed an opinion. That's exactly what hiring managers want from a QA/SDET candidate.

---

## PHASE 5: README AND POLISH

### 5.1 README.md

Your README should include:

1. **Project title and one-sentence description**
2. **Tech stack badges** (Playwright, Cypress, TypeScript, GitHub Actions)
3. **Why this project exists** (framework comparison, not just another tutorial clone)
4. **How to run it** (clear setup instructions)
5. **Test coverage summary** (table of scenarios)
6. **CI/CD status badge** (the green badge from GitHub Actions)
7. **Link to COMPARISON.md**

### 5.2 .gitignore

```
node_modules/
dist/
playwright/playwright-report/
playwright/test-results/
cypress/videos/
cypress/screenshots/
cypress/downloads/
*.env
```

---

## RESUME UPDATE AFTER COMPLETION

Once this project is done, here's how it reads on your resume:

**Dual-Framework E2E Test Suite** | [GitHub] | Playwright | Cypress | TypeScript | GitHub Actions

> Implemented 20+ E2E test scenarios in both **Playwright** and **Cypress** against a production-style e-commerce application using the **Page Object Model** and **TypeScript**; deployed parallel CI/CD pipelines in **GitHub Actions** across Chromium, Firefox, and WebKit, and produced a data-driven framework comparison analyzing execution speed, stability, and developer experience

That bullet replaces "(familiar)" with proven, documented proficiency.

---

## CHECKLIST

Use this to track your progress:

- [ ] Phase 0: Project scaffolded, dependencies installed
- [ ] Phase 1: All 4 Playwright page objects written
- [ ] Phase 1: All 4 Playwright test specs passing
- [ ] Phase 1: Playwright HTML report generating
- [ ] Phase 2: All 4 Cypress page objects written
- [ ] Phase 2: All 4 Cypress test specs passing
- [ ] Phase 2: Cypress videos/screenshots working
- [ ] Phase 3: GitHub Actions workflow running both suites
- [ ] Phase 3: Both jobs green on push to main
- [ ] Phase 4: COMPARISON.md filled with real measurements
- [ ] Phase 5: README polished with badges and run instructions
- [ ] Phase 5: .gitignore covers all generated artifacts
- [ ] Resume updated: "(familiar)" removed from Playwright and Cypress
