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
