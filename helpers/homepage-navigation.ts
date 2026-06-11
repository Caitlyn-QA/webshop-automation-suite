import { test } from '@playwright/test';

export function setupHomepage() {

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

}