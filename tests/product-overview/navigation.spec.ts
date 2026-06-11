//https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5?id=product-overview  AC2

import { test, expect } from "@playwright/test";
import { setupHomepage } from '../../helpers/homepage-navigation';

setupHomepage();

test.describe("Product Detail Navigation", () => {
    test('clicking product card opens the correct product detail page', async ({ page }) => {

        const combinationPliersCard = page.locator('a.card').filter({ has: page.getByRole('heading', { name: /^Combination Pliers$/ }) });
        const combinationPliersHrefValue = await combinationPliersCard.getAttribute('href');
        expect(combinationPliersHrefValue).not.toBeNull();

        await combinationPliersCard.click();
        await expect(page).toHaveURL(new RegExp(combinationPliersHrefValue!));

        const productDetailTitle = page.locator('h1[data-test="product-name"]');
        await expect(productDetailTitle).toHaveText(/Combination Pliers/i);

    });
});


