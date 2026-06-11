// Product Overview - AC3 Pagination
// Reference: https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5?id=product-overview
import { test, expect } from "@playwright/test";
import { setupHomepage } from '../../helpers/homepage-navigation';

setupHomepage();

test.describe('Pagination', () => {

    test('pagination controls display correct initial state', async ({ page }) => {

        await expect(page.locator('ul.pagination')).toBeVisible();
        const previousButtonContainer = page.locator('li.page-item').filter({ has: page.getByRole('button', { name: 'Previous' }) });

        await expect(previousButtonContainer).toHaveClass(/disabled/)
        await expect(page.locator('li.page-item.active')).toContainText('1');

    });

    test('clicking page 2 changes visible products', async ({ page }) => {

        const firstProductBeforeClick = await page.locator('[data-test="product-name"]').first().textContent();
        const page1ProductNames = await page.locator('h5[data-test="product-name"]').allTextContents();
        const page2 = page.getByRole('button', { name: 'Page-2' });
        await page2.click();

        await expect(async () => {
            const firstProductAfterClick = await page.locator('[data-test="product-name"]').first().textContent();
            expect(firstProductAfterClick).not.toBe(firstProductBeforeClick);
        }).toPass();

        const page2ProductNames = await page.locator('h5[data-test="product-name"]').allTextContents();

        expect(page1ProductNames).not.toEqual(page2ProductNames);
    });

    test('active page indicator changes after navigation', async ({ page }) => {

        await page.getByRole('button', { name: 'Page-2' }).click();

        await expect(async () => {

            await expect(page.locator('li.page-item.active')).toContainText('2');

        }).toPass();
    });

});
