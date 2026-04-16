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
