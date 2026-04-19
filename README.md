# Dual-Framework E2E Test Suite: Playwright + Cypress

[![E2E Tests](https://github.com/AtharvaK14/Dual-Framework-E2E-Test-Suite-Playwright-Cypress/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/AtharvaK14/Dual-Framework-E2E-Test-Suite-Playwright-Cypress/actions/workflows/e2e-tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-69D3A7?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

Identical E2E test scenarios implemented in both **Playwright** and **Cypress**, targeting a real e-commerce application. Built to evaluate and compare both frameworks with real data, not to follow a tutorial.

## What This Project Does

This project runs the same 22 test scenarios against [SauceDemo](https://www.saucedemo.com/) (a purpose-built e-commerce site by Sauce Labs) using two different test frameworks. Both suites use TypeScript, the Page Object Model pattern, and run in CI via GitHub Actions. The result is a side-by-side comparison backed by actual execution data.

## Test Scenarios

| Area | Tests | What's Covered |
|------|-------|----------------|
| Login | 5 | Valid login, locked-out user, invalid credentials, empty username, empty password |
| Inventory | 8 | Product count, add/remove cart items, sort by name (A-Z, Z-A), sort by price, logout |
| Cart | 4 | Add item to cart, remove item from cart, continue shopping, cart persistence across sessions |
| Checkout | 5 | Complete purchase, missing first name/last name/zip validation, price total verification |

Playwright runs all tests across Chromium, Firefox, and WebKit (66 total runs). Cypress runs all tests on Electron/Chrome (19 runs).

## Project Structure

```
├── playwright/
│   ├── pages/                  # Page Object Model classes
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── tests/                  # Test specs
│   │   ├── login.spec.ts
│   │   ├── inventory.spec.ts
│   │   ├── cart.spec.ts
│   │   └── checkout.spec.ts
│   ├── fixtures/users.json     # Test data
│   └── playwright.config.ts
│
├── cypress/
│   ├── support/pages/          # Page Object Model classes
│   │   ├── LoginPage.ts
│   │   ├── InventoryPage.ts
│   │   ├── CartPage.ts
│   │   └── CheckoutPage.ts
│   ├── e2e/                    # Test specs
│   │   ├── login.cy.ts
│   │   ├── inventory.cy.ts
│   │   ├── cart.cy.ts
│   │   └── checkout.cy.ts
│   ├── support/
│   │   ├── commands.ts         # Custom Cypress commands
│   │   └── e2e.ts
│   ├── fixtures/users.json
│   └── tsconfig.json
│
├── .github/workflows/
│   └── e2e-tests.yml           # CI pipeline (both suites in parallel)
├── cypress.config.ts
├── tsconfig.json
├── COMPARISON.md               # Framework comparison document
└── package.json
```

## Prerequisites

You need two things installed before starting:

1. **Node.js** (LTS version, v20 or later) - download from https://nodejs.org/
2. **Git** - download from https://git-scm.com/

To verify both are installed, open a terminal and run:

```bash
node --version
npm --version
git --version
```

All three should return version numbers. If `npm` is not recognized on Windows, see the [Windows Setup Notes](#windows-setup-notes) section below.

## Setup

**1. Clone the repository**

```bash
git clone https://github.com/AtharvaK14/Dual-Framework-E2E-Test-Suite-Playwright-Cypress.git
cd Dual-Framework-E2E-Test-Suite-Playwright-Cypress
```

**2. Install dependencies**

```bash
npm install
```

This installs Playwright, Cypress, TypeScript, and all other packages listed in `package.json`. It also creates a `node_modules/` folder (not committed to the repo).

**3. Install Playwright browsers**

```bash
npx playwright install
```

This downloads the Chromium, Firefox, and WebKit browser binaries that Playwright needs. It runs once and takes a few minutes.

Cypress downloads its browser automatically on first run, so no extra step is needed.

## Running Tests

### Playwright

```bash
# Run all tests headless (Chromium + Firefox + WebKit)
npm run pw:test

# Run with browser windows visible (useful for debugging)
npm run pw:test:headed

# Open the HTML test report after a run
npm run pw:report
```

### Cypress

```bash
# Run all tests headless (terminal output + video recording)
npm run cy:run

# Open the Cypress interactive test runner
npm run cy:open
```

### Both Frameworks

```bash
# Run Playwright first, then Cypress, sequentially
npm run test:all
```

### Type Checking

```bash
# Verify TypeScript compiles with no errors
npm run lint
```

## CI/CD

The GitHub Actions workflow (`.github/workflows/e2e-tests.yml`) runs automatically on every push to `main` and on pull requests. It has two parallel jobs:

1. **Playwright Tests** - installs dependencies, downloads browsers, runs the full suite, uploads the HTML report as an artifact
2. **Cypress Tests** - installs dependencies, runs the full suite, uploads videos and failure screenshots as artifacts

Both jobs run on `ubuntu-latest` with Node.js 22. Test reports are retained for 14 days and can be downloaded from the Actions tab.

## Framework Comparison

See [COMPARISON.md](./COMPARISON.md) for a detailed side-by-side analysis covering setup complexity, execution speed, cross-browser support, developer experience, and recommendations for when to use which framework.

## Windows Setup Notes

If you installed Node.js on Windows and `npm` is not recognized in your terminal, try these fixes in order:

1. **Close and fully reopen your terminal or VS Code.** The system PATH updates when a new terminal session starts, not in existing ones.

2. **If using PowerShell and you see an "execution policy" error**, run this once:
   ```powershell
   Set-ExecutionPolicy -Scope CurrentUser RemoteSigned
   ```
   Type `Y` to confirm. This allows npm scripts to run in PowerShell.

3. **If VS Code still does not recognize `npm`**, close VS Code entirely (not just the terminal) and reopen it. VS Code loads the PATH on startup.

## Built With

- [Playwright](https://playwright.dev/) - Cross-browser E2E testing framework by Microsoft
- [Cypress](https://www.cypress.io/) - JavaScript-based E2E testing framework
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [SauceDemo](https://www.saucedemo.com/) - Test automation practice site by Sauce Labs
- [GitHub Actions](https://github.com/features/actions) - CI/CD platform

## Author

**Atharva Kadam** - [GitHub](https://github.com/AtharvaK14)