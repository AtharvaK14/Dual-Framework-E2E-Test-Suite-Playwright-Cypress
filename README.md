# Dual-Framework E2E Test Suite

[![E2E Tests](https://github.com/YOUR_USERNAME/dual-framework-e2e/actions/workflows/e2e-tests.yml/badge.svg)](https://github.com/YOUR_USERNAME/dual-framework-e2e/actions/workflows/e2e-tests.yml)
![Playwright](https://img.shields.io/badge/Playwright-2EAD33?logo=playwright&logoColor=white)
![Cypress](https://img.shields.io/badge/Cypress-69D3A7?logo=cypress&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)
![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?logo=githubactions&logoColor=white)

The same E2E test scenarios implemented in **both Playwright and Cypress**, targeting a real e-commerce application. Not a tutorial clone. A side-by-side evaluation with real measurements and an evidence-based framework comparison.

## Why This Exists

Most QA portfolios demonstrate one framework. This project implements identical test scenarios in both, then measures and compares the results. The goal is framework proficiency backed by data, not familiarity.

## Target Application

[SauceDemo](https://www.saucedemo.com/) by Sauce Labs. A purpose-built e-commerce site for test automation with login flows, product catalogs, cart management, checkout, and intentionally buggy user accounts.

## Test Coverage

| Area | Scenarios | What's Tested |
|------|-----------|---------------|
| Login | 5 | Valid login, locked user, invalid creds, empty fields |
| Inventory | 8 | Item count, add/remove cart, sorting (A-Z, Z-A, price), logout |
| Cart | 4 | Add item, remove item, continue shopping, cart persistence |
| Checkout | 5 | Full checkout, missing field validation, price total |

All scenarios run across both frameworks with identical assertions.

## Tech Stack

- **TypeScript** for both frameworks
- **Page Object Model** architecture
- **GitHub Actions** CI/CD running both suites in parallel
- **Playwright**: Chromium, Firefox, WebKit
- **Cypress**: Chrome with video recording

## Getting Started

### Prerequisites

- Node.js v20.x or v22.x
- Git

### Installation

```bash
git clone https://github.com/YOUR_USERNAME/dual-framework-e2e.git
cd dual-framework-e2e
npm install
npx playwright install
```

### Running Tests

```bash
# Playwright (all browsers, headless)
npm run pw:test

# Playwright (headed, for debugging)
npm run pw:test:headed

# Playwright HTML report
npm run pw:report

# Cypress (interactive)
npm run cy:open

# Cypress (headless)
npm run cy:run

# Both frameworks
npm run test:all

# Type check
npm run lint
```

## Framework Comparison

See [COMPARISON.md](./COMPARISON.md) for the full side-by-side analysis with execution times, developer experience notes, and recommendations.

## Project Structure

```
dual-framework-e2e/
├── playwright/
│   ├── tests/          # Playwright test specs
│   ├── pages/          # Page Object Model classes
│   ├── fixtures/       # Test data
│   └── playwright.config.ts
├── cypress/
│   ├── e2e/            # Cypress test specs
│   ├── support/pages/  # Page Object Model classes
│   └── fixtures/       # Test data
├── .github/workflows/  # CI/CD pipeline
├── cypress.config.ts
├── COMPARISON.md       # Framework comparison writeup
└── README.md
```
