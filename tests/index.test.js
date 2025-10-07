const axios = require("axios");

function sum(a, b) {
    return a + b
}

const BACKEND_URL = 'http://localhost:3000'

describe("Authenticaiton", () => {
    test('user is able to signup only once', async () => {
        const username = "samar" + Math.random();
        const password = '1234567';
        const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        })

        expect(response.statusCode).toBe(200)

        const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password,
            type: 'admin'
        })

        expect(updatedResponse.statusCode).toBe(400)
    });

    test('Signup request fails if the username is empty', async () => {
        const username = "kirat" + Math.random();
        const password = '123456'

        const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
            password
        })

        expect(response.statusCode).toBe(400)

    })

    test('Signin succeeds if the username and password are correct', async () => {
        const username = `kirat-${Math.random()}`
        const password = '123456'

        await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
            username,
            password
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username,
            password
        })

        expect(response.statusCode).toBE(200)
        expect(response.body.token).toBEDefined()

    })

    test('Signin fails if the username and password are incorrect', async () => {
        const username = `kirat-${Math.random()}`
        const password = '123456'

        await axios.post(`${BACKEND_URL}/api/v1/signup`, {
            username,
            password
        });

        const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
            username: "WrongUsername",
            password
        })

        expect(response.statusCode).toBe(403)
    })

})


describe("User Information endpoints", () =>{
    
})


