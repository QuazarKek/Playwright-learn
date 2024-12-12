import * as myMock from './MOCK/mock'
const { test, expect } = require('@playwright/test');

test.describe('Mock a Service', () => {

    test.beforeEach(async ({ page }) => {
        await myMock.mockPetApi(page);
        await myMock.mockInventoryApi(page);
        await myMock.mockUserApi(page);
        await myMock.mockUserPostApi(page);
        await page.goto("https://petstore.swagger.io/");
        await page.getByRole('button', { name: 'Allow all cookies' }).click();
    });

    test('Mock Swagger APIs', async ({ page }) => {

        await page.getByRole('button', { name: 'GET /pet/findByStatus Finds' }).click();
        await page.getByRole('button', { name: 'Try it out' }).click();
        await page.getByRole('listbox').selectOption('sold');
        await page.getByRole('button', { name: 'Execute' }).click();

        await expect(page.locator('#operations-pet-findPetsByStatus')).toContainText('"doggie_shmoggy"');

        await page.getByRole('button', { name: 'GET /store/inventory Returns' }).click();
        await page.getByRole('button', { name: 'Try it out' }).click();
        await page.locator('#operations-store-getInventory').getByRole('button', { name: 'Execute' }).click();

        await expect(page.locator('#operations-store-getInventory')).toContainText('"1000 chertey"');

        await page.getByRole('button', { name: 'GET /user/{username} Get user' }).getByRole('link').click();
        await page.getByRole('button', { name: 'Try it out' }).click();
        await page.getByPlaceholder('username').click();
        await page.getByPlaceholder('username').fill('gorg');
        await page.locator('#operations-user-getUserByName').getByRole('button', { name: 'Execute' }).click();

        await expect(page.locator('#operations-user-getUserByName')).toContainText('"gorg"');

        await page.getByRole('button', { name: 'POST /user Create user' }).click();
        await page.getByRole('button', { name: 'Try it out' }).click();
        await page.locator('#operations-user-createUser').getByRole('button', { name: 'Execute' }).click();

        await expect(page.locator('#operations-user-createUser')).toContainText('"message": "SUCCESS"');
    });

});