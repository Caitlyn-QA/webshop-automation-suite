// Product Overview - AC1 Product Grid Display
// Reference: https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5?id=product-overview

import { test, expect, Page } from "@playwright/test";
import { setupHomepage } from '../../helpers/homepage-navigation';

setupHomepage();

async function getRenderedProductCards(page: Page) {
  const productCards = page.locator('a.card');
  await expect(productCards).toHaveCount(9);
  return productCards;
}


test.describe("Product Grid Rendering", () => {
  test("product grid displays product cards on the homepage", async ({ page }) => {
    await getRenderedProductCards(page);
  });
});


test.describe("Product Card Content", () => {
  test("each product card displays an image for the product", async ({ page }) => {
    const productCards = await getRenderedProductCards(page);

    for (const productCard of await productCards.all()) {
      const productImage = productCard.getByRole('img');
      await expect(productImage).toBeVisible();
    }
  });


  test("each product card displays the product name", async ({ page }) => {
    const productCards = await getRenderedProductCards(page);

    for (const productCard of await productCards.all()) {
      const productTitle = productCard.locator('[data-test="product-name"]');
      await expect(productTitle).toBeVisible();
    }
  });

  test("each product card displays the product price", async ({ page }) => {
    const productCards = await getRenderedProductCards(page);

    for (const productCard of await productCards.all()) {
      const productPrice = productCard.locator('[data-test="product-price"]');
      await expect(productPrice).toBeVisible();
    }
  });
});
