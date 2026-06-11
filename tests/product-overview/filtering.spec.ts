// Product Overview - AC5 Category Filter
// Product Overview - AC6 Hierarchical Category Selection
// Reference: https://testsmith-io.github.io/practice-software-testing/#/user-stories/v5?id=product-overview 
import { test, expect } from "@playwright/test";
import { setupHomepage } from '../../helpers/homepage-navigation';


setupHomepage();

test.describe('Basic Filtering', () => {

    test('selecting Drill Category hides a known unrelated product', async ({ page }) => {

        const combinationPliersProduct = page.locator('a.card').filter({ has: page.getByRole('heading', { name: /\s*Combination Pliers\s*/ }) });
        const drillCheckbox = page.getByRole('checkbox', { name: 'Drill' });

        await expect(combinationPliersProduct).toBeVisible();

        await drillCheckbox.check();

        await expect(combinationPliersProduct).not.toBeVisible();

    });



    test('selecting Chisels and Saw checkboxes combines matching products', async ({ page }) => {

        const chiselsCheckbox = page.getByRole('checkbox', { name: /^\s*Chisels\s*$/ });

        await chiselsCheckbox.check();

        const chiselsProduct = page.locator('a.card').filter({ has: page.getByRole('heading', { name: /^\s*Chisels Set\s*$/ }) });

        await expect(chiselsProduct).toBeVisible();

        const sawCheckbox = page.getByRole('checkbox', { name: /^\s*Saw\s*$/ });
        await sawCheckbox.check();
        const sawProduct = page.locator('a.card').filter({ has: page.getByRole('heading', { name: /^\s*Circular Saw\s*$/ }) });
        await expect(sawProduct).toBeVisible();

    });


    test('unchecking category restores original product list', async ({ page }) => {


        const combinationPliersProduct = page.locator('a.card').filter({ has: page.getByRole('heading', { name: /\s*Combination Pliers\s*/ }) });
        await expect(combinationPliersProduct).toBeVisible();

        const initialStateProductTitles = await page.locator('h5[data-test="product-name"]').allTextContents();

        const sanderCheckbox = page.getByRole('checkbox', { name: /^\s*Sander\s*$/ });
        await sanderCheckbox.check();
        await expect(combinationPliersProduct).not.toBeVisible();

        const filteredStateProductTitles = await page.locator('h5[data-test="product-name"]').allTextContents();
        expect(filteredStateProductTitles).not.toEqual(initialStateProductTitles);
        await sanderCheckbox.uncheck();


        await expect(combinationPliersProduct).toBeVisible();

        const restoredStateProductTitles = await page.locator('h5[data-test="product-name"]').allTextContents();

        expect(restoredStateProductTitles).toEqual(initialStateProductTitles);

    });

});

test.describe('Filtering + Pagination', () => {

    test('selected filter remains active after page change', async ({ page }) => {

        const forgeFlexToolsCheckbox = page.getByRole('checkbox', { name: /^\s*ForgeFlex Tools\s*$/ });
        await forgeFlexToolsCheckbox.check();
        const initialActivePagBtn = await page.locator('li.page-item.active').getByRole('button').textContent();
        const nextButton = page.getByRole('button', { name: 'Next' });
        await nextButton.click();
        const nextActivePagBtn = await page.locator('li.page-item.active').getByRole('button').textContent();
        expect(initialActivePagBtn).not.toEqual(nextActivePagBtn);
        await expect(forgeFlexToolsCheckbox).toBeChecked();

    });

});

test.describe('Hierarchical Filtering', () => {

    test('parent category checks children', async ({ page }) => {

        const handToolsParentCategory = page.getByRole('checkbox', { name: /^\s*Hand Tools\s*$/ });
        const handToolsContainer = page.locator('div.checkbox').filter({ has: handToolsParentCategory });
        const childHandToolCategories = handToolsContainer.locator('ul').getByRole('checkbox');

        await handToolsParentCategory.check();

        const childCount = await childHandToolCategories.count();


        expect(childCount).toBeGreaterThan(0);

        for (let i = 0; i < childCount; i++) {
            await expect(childHandToolCategories.nth(i)).toBeChecked();
        }

    });

});

test.describe('Category Data Validation', () => {

    test('all visible products belong to selected category', async ({ page }) => {

        const safetyGearCheckbox = page.getByRole('checkbox', { name: /^\s*Safety Gear\s*$/ })
        const productCards = page.locator('a.card')
        const productNames = productCards.getByRole('heading');
        // Wait for product grid to render 
        await expect(productCards.first()).toBeVisible();

        const initialProductNames = await productNames.allTextContents();

        await safetyGearCheckbox.check();



        // Wait for product grid to rerender after filtering
        await expect(productNames).not.toHaveText(initialProductNames);


        const productUrls: string[] = [];
        const productNumber = await productCards.count();

        for (let i = 0; i < productNumber; i++) {

            const href = await productCards.nth(i).getAttribute('href');

            if (href) {
                productUrls.push(href);
            }
        }


        for (const productUrl of productUrls) {


            await page.goto(productUrl);

            const categoryLabel = page.locator('span[aria-label="category"]');
            await expect(categoryLabel).toContainText(/^\s*Safety Gear\s*$/)
        }

    });


});

