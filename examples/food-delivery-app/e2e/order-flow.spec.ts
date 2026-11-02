import { expect, test } from '@playwright/test';

test.describe('Food ordering happy path', () => {
  test('browse → add to cart → login → checkout → track', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Hungry? 🍽️' })).toBeVisible();

    // search is debounced and calls GET /restaurants?q=
    await page.getByLabel('Search').fill('spice');
    await expect(page.locator('app-restaurant-card')).toHaveCount(1);

    await page.getByText('Spice Route').click();
    await page.locator('.item').filter({ hasText: 'Butter Chicken' }).getByRole('button', { name: 'ADD' }).click();
    await expect(page.locator('.cart-bar')).toContainText('1 items');

    await page.locator('.cart-bar').click();
    await expect(page.getByTestId('total')).toHaveText('₹366.00'); // 320 + 30 delivery + 16 GST

    await page.getByRole('link', { name: 'Proceed to checkout' }).click();
    await expect(page).toHaveURL(/\/login\?returnUrl=%2Fcheckout/); // authGuard redirect

    await page.locator('input[type=email]').fill('customer@food.dev');
    await page.locator('input[type=password]').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();

    await expect(page).toHaveURL(/\/checkout$/);
    await page.locator('input[formcontrolname=line1]').fill('12 MG Road');
    await page.locator('input[formcontrolname=city]').fill('Bengaluru');
    await page.locator('input[formcontrolname=pincode]').fill('560001');
    await page.getByRole('button', { name: /Pay/ }).click();

    await expect(page).toHaveURL(/\/orders\/o\d+/);
    await expect(page.locator('.timeline li.done')).not.toHaveCount(0);
  });

  test('customers cannot reach /admin', async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[type=email]').fill('customer@food.dev');
    await page.locator('input[type=password]').fill('password');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await expect(page.getByText('Hi, Asha')).toBeVisible(); // login finished

    await page.goto('/admin');
    await expect(page.getByRole('heading', { name: '403' })).toBeVisible();
  });
});
