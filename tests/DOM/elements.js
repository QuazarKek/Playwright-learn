import { expect } from "@playwright/test";

export class LoginPage{
    constructor(page){
        this.page = page;
        this.userNameInput = page.locator('[data-test="username"]');
        this.userPassInput = page.locator('[data-test="password"]');
        this.loginBtn = page.locator('[data-test="login-button"]');
        this.errorMessage = page.locator('[data-test="error"]');
        this.errorMessageBtn = page.locator('[data-test="error-button"]');
        this.textLogo = page.locator('[class="login_logo"]');
    }

    async logIn(name, pass){
        await this.userNameInput.fill(name);
        await this.userPassInput.fill(pass);
        await this.loginBtn.click();
    }
}

export class ProductsPage{
    constructor(page){
        this.page = page;
        this.container = page.locator('[data-test="inventory-list"]');
        this.sortBtn = page.locator('[data-test="product-sort-container"]');
        this.priceElements = page.locator('.inventory_item_price');
        this.productCounter = page.locator('.shopping_cart_badge');
        this.cartBtn = page.locator('[class="shopping_cart_link"]');
    }

    async GetInnerTextArray(elementsArray){
        const newList = [];
        const elementsCount = await elementsArray.count();
        for (let i = 0; i < elementsCount; i++) {
            const innerText = await elementsArray.nth(i).innerText();
            newList.push(innerText.trim());
        }
        return newList;
    }

    async GetInnerTextArrayAsNumbers(elementsArray){
        const newArray = [];
        const elementsCount = await elementsArray.count();
        for (let i = 0; i < elementsCount; i++) {
            const innerText = await elementsArray.nth(i).innerText();
            newArray.push(innerText.trim());
        }
        const parseTextArray = (number) => parseFloat(number.replace('$', ''));
        const numericArray = newArray.map(parseTextArray);

        return numericArray;
    }

    async AddToCartOrRemoveBtnClk(productName){
        const loc = `//*[text()="${productName}"]/../../../div[2]//button`;
        await this.page.locator(loc).click();
    }

    // AddToCartOrRemoveBtnLocator(productName){
    //     return `//*[text()="${productName}"]/../../../div[2]//button`;
    // }

    AddRemoveBtnLocator(productNumber){
        return `//*[@id="inventory_container"]//*[@class="inventory_item"][${productNumber}]//*[contains(@class,'btn_inventory')]`;
    }

    ProductNameLocator(productNumber){
        return `//*[@id="inventory_container"]//*[@class="inventory_item"][${productNumber}]//*[@class='inventory_item_name ']`;
    }

    ProductDescriptionLocator(productNumber){
        return `//*[@id="inventory_container"]//*[@class="inventory_item"][${productNumber}]//*[@class='inventory_item_desc']`;
    }   
    
    ProductPriceLocator(productNumber){
        return `//*[@id="inventory_container"]//*[@class="inventory_item"][${productNumber}]//*[@class='inventory_item_price']`;
    }
}

export class CartPage{
    constructor(page){
        this.page = page;
        this.itemName = page.locator('.inventory_item_name');
        this.itemDesc = page.locator('.inventory_item_desc');
        this.itemPrice = page.locator('.inventory_item_price');
        this.removeBtn = page.locator('#remove-sauce-labs-bolt-t-shirt');
        this.itemContainer = page.locator('.cart_item');
        this.continueBtn = page.locator('#continue-shopping');
        this.checkoutBtn = page.locator('#checkout');
    }
}

export class CheckoutPage{
    constructor(page){
        this.page = page;
        this.inputFirstName = page.locator('#first-name');
        this.inputLastName = page.locator('#last-name');
        this.inputZipCode = page.locator('#postal-code');
        this.checkoutBtn = page.locator('#continue');
    }
}

export class OverviewPage{
    constructor(page){
        this.page = page;
        this.itemPrice = page.locator('.inventory_item_price');
        this.itemTotalPrice = page.locator('.summary_subtotal_label');
        this.finishBtn = page.locator('#finish');
    }
}

export class CompletePage{
    constructor(page){
        this.page = page;
        this.image = page.locator('.pony_express');
    }
}