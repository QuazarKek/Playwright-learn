const { test, expect } = require('@playwright/test');
const fs = require('fs');

const filename = 'bookingData.json';

test.describe('API requests', () => {
    const USER = {
        email: "admin",
        pwd: "password123",
        token: ""
    }

    test.beforeEach('API token Request', async ({ request }) => {
        const res = await request.post('https://restful-booker.herokuapp.com/auth', {
            form: {
                "username": USER.email,
                "password": USER.pwd
            }
        });
        expect(res.status()).toBe(200);
        const body = await res.json();
        USER.token = body.token;
        console.log("token", USER.token);
    });

    test('API POST Rrequest', async ({ request }) => {
        const res = await request.post("https://restful-booker.herokuapp.com/booking", {
            data: {
                "firstname": "Jim",
                "lastname": "Brown",
                "totalprice": 111,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2018-01-01",
                    "checkout": "2019-01-01"
                },
                "additionalneeds": "Breakfast"
            }
        });

        const bookingData = await res.json();
        console.log("Created CreateBooking", bookingData);
        const filename = 'bookingData.json';
        saveDataToFile(bookingData, filename);

        expect(res.status()).toBe(200);
    })

    test('API PUT Rrequest', async ({ request }) => {
        const dataFromFile = readDataFromFile(filename);
        const id = dataFromFile.bookingid;

        const res = await request.put(`https://restful-booker.herokuapp.com/booking/${id}`, {
            headers:{
                'Cookie': 'token=' + USER.token
            },
            data: {
                "firstname": "Tom",
                "lastname": "Swamp",
                "totalprice": 100,
                "depositpaid": true,
                "bookingdates": {
                    "checkin": "2024-01-01",
                    "checkout": "2024-01-02"
                },
                "additionalneeds": "Lunch"
            }
        });

        const bookingDataUpdated = await res.json();
        console.log("Created CreateBooking", bookingDataUpdated);
        saveDataToFile(bookingDataUpdated, filename);

        expect(res.status()).toBe(200);
    })
});

function saveDataToFile(data, filename) {
    fs.writeFileSync(filename, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`Data saved to ${filename}`);
}

function readDataFromFile(filename) {
    const data = fs.readFileSync(filename, 'utf-8');
    return JSON.parse(data);
  }