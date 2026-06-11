// AC4 - Search
// User Story Reference: https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5?id=product-overview

import { test, expect } from "@playwright/test";
import { setupHomepage } from '../../helpers/homepage-navigation';

setupHomepage();

test.describe('Product Search', () => {

    test('search displays only matching products', async ({ page }) => {

        const searchText = 'saw';

        const productTitles = page.locator('h5[data-test="product-name"]' );

        await expect(productTitles.first()).toBeVisible();

        const initialTitles = await productTitles.allTextContents();

        await page.getByLabel('Search').fill(searchText);
        await page.getByRole('button', { name: 'Search' }).click();

        // Wait for search results to replace the original grid
        await expect(productTitles).not.toHaveText(initialTitles);

        const filteredTitles = await productTitles.allTextContents();

        for (const title of filteredTitles) {
            expect(
                title.toLowerCase()
            ).toContain(searchText);
        }


    });

    test('search resets active filters', async ({ page }) => {

        const drillCheckbox = page.getByRole('checkbox', { name: 'Drill' });
        await drillCheckbox.check();
        await page.getByLabel('Search').fill('saw');
        await page.getByRole('button', { name: 'Search' }).click();

        await expect(drillCheckbox).not.toBeChecked();

    });

});