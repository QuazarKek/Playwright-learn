import * as elements from './DOM/elements';

const { test, expect } = require('@playwright/test');
const lockedUser = 'locked_out_user';
const standardUser = 'standard_user';
const pass = 'secret_sauce';

test.beforeEach(async ({ page }) => {
    await page.goto('https://www.saucedemo.com/');
  });

test.afterAll(async ({ page }) => {
    await page.close();
});

test('Task 1: login with locked user', {tag: '@loginFlow'}, async ({ page }) => {
    const loginPage = new elements.LoginPage(page);

    await loginPage.userNameInput.fill(lockedUser);
    await loginPage.userPassInput.fill(pass);
    await loginPage.loginBtn.click();

    await expect(loginPage.errorMessage).toBeVisible();
    await expect(loginPage.textLogo).toBeVisible();

    await loginPage.errorMessageBtn.click();

    await expect(loginPage.errorMessage).toBeHidden();
});

test('Task 2: login with standard user', async ({ page }) => {
    const productNumber = "3";
    const loginPage = new elements.LoginPage(page);
    const productPage = new elements.ProductsPage(page);
    const cartPage = new elements.CartPage(page);
    const checkoutPage = new elements.CheckoutPage(page);
    const overviewPage = new elements.OverviewPage(page);
    const completePage = new elements.CompletePage(page);
    loginPage.logIn(standardUser, pass);

    await expect(productPage.container).toBeVisible();
    
    await productPage.sortBtn.selectOption('lohi');
    const actualPriceArray = await productPage.GetInnerTextArrayAsNumbers(await productPage.priceElements);
    const expectedPriceArray = [...actualPriceArray].sort((a, b) => a - b);

    expect(actualPriceArray).toEqual(expectedPriceArray);

    const nameOfProduct = await page.locator(productPage.ProductNameLocator(productNumber)).innerText();
    const descOfProduct = await page.locator(productPage.ProductDescriptionLocator(productNumber)).innerText();
    const priceOfProduct = await page.locator(productPage.ProductPriceLocator(productNumber)).innerText();
    await productPage.AddToCartOrRemoveBtnClk(nameOfProduct);

    await expect(page.locator(productPage.AddRemoveBtnLocator(productNumber))).toHaveText("Remove");
    await expect(productPage.productCounter).toHaveText("1");

    await productPage.cartBtn.click();

    expect(await cartPage.itemName.innerText()).toEqual(nameOfProduct);
    expect(await cartPage.itemDesc.innerText()).toEqual(descOfProduct);
    expect(await cartPage.itemPrice.innerText()).toEqual(priceOfProduct);

    await cartPage.removeBtn.click();

    await expect(cartPage.itemContainer).not.toBeVisible();

    await cartPage.continueBtn.click();
    const nameOfProduct2 = 'Sauce Labs Backpack';
    await productPage.AddToCartOrRemoveBtnClk(nameOfProduct2);
    await productPage.cartBtn.click();
    await cartPage.checkoutBtn.click();
    await checkoutPage.inputFirstName.fill("John");
    await checkoutPage.inputLastName.fill("Doe");
    await checkoutPage.inputZipCode.fill("12345");
    await checkoutPage.checkoutBtn.click();
    
    expect(await overviewPage.itemTotalPrice.innerText()).toContain(await overviewPage.itemPrice.innerText());

    await overviewPage.finishBtn.click();

    await expect(completePage.image).toBeVisible();
});