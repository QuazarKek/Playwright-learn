const fs = require('fs');
const path = require('path');

const readJsonFile = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading or parsing file at ${filePath}:`, error);
        throw error;
    }
};

const fulfillRoute = async (route, response, headers) => {
    try {
        await route.fulfill({
            status: 200,
            contentType: 'application/json',
            body: JSON.stringify(response),
            headers,
        });
    } catch (error) {
        console.error('Error fulfilling route:', error);
        throw error;
    }
};

const defaultHeaders = Object.freeze({
    'accept': 'application/json',
    'accept-language': 'en-US,en;q=0.9,tr;q=0.8',
    'priority': 'u=1, i',
    'referer': 'https://petstore.swagger.io/',
});

const mockPetApi = async (page) => {
    const petJsonFilePath = path.resolve(__dirname, '../MOCK/mocks/findByStatus.json');
    const petJsonResponse = readJsonFile(petJsonFilePath);

    await page.route('**/v2/pet/findByStatus?status=sold', async (route) => {
        await fulfillRoute(route, petJsonResponse, defaultHeaders);
    });
};

const mockInventoryApi = async (page) => {
    const inventoryJsonFilePath = path.resolve(__dirname, '../MOCK/mocks/inventoryResponse.json');
    const inventoryJsonResponse = readJsonFile(inventoryJsonFilePath);

    await page.route('**/v2/store/inventory', async (route) => {
        await fulfillRoute(route, inventoryJsonResponse, defaultHeaders);
    });
};

const mockUserApi = async (page) => {
    const userJsonFilePath = path.resolve(__dirname, '../MOCK/mocks/humanSpecies.json');
    const userJsonResponse = readJsonFile(userJsonFilePath);
    await page.route('**/v2/user/gorg', async (route) => {
        await fulfillRoute(route, userJsonResponse, defaultHeaders);
    });
};

const mockUserPostApi = async (page) => {
    const postResponse = {
        code: 201,
        type: "YAY",
        message: "SUCCESS"
    };

    const postHeaders = {
        ...defaultHeaders,
        'content-type': 'application/json',
    };

    await page.route('**/v2/user', async (route) => {
        if (route.request().method() === 'POST') {
            const postData = route.request().postData();
            console.log('Received POST data:', postData);

            await fulfillRoute(route, postResponse, postHeaders);
        }
    });
};

module.exports = {
    mockPetApi,
    mockInventoryApi,
    mockUserApi,
    mockUserPostApi,
};