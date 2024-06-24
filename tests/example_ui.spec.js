// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  // Navigate to the JSONPlaceholder homepage
  await page.goto('https://jsonplaceholder.typicode.com/');

  // Debugging: Log the page title
  console.log(page.title());

  // Expect the page title to contain a specific substring
  await expect(page).toHaveTitle(/JSONPlaceholder - Free Fake REST API/);
});

test('get started link', async ({ page }) => {
  // Navigate to the JSONPlaceholder homepage
  await page.goto('https://jsonplaceholder.typicode.com/');

  // Click on the "Guide" link
  await page.getByRole('link', { name: 'Guide' }).nth(1).click();

  // Expect the page to have a heading with the text "Guide"
  await expect(page.getByRole('heading', { name: 'Guide' })).toBeVisible();
});
