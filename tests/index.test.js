const axios = require("axios");

function sum(a, b) {
  return a + b
}

const BACKEND_URL = 'http://localhost:3000'

// describe("Authenticaiton", () => {
//     test('user is able to signup only once', async () => {
//         const username = "samar" + Math.random();
//         const password = '1234567';
//         const response = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//             username,
//             password,
//             type: 'admin'
//         })

//         expect(response.statusCode).toBe(200)

//         const updatedResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//             username,
//             password,
//             type: 'admin'
//         })

//         expect(updatedResponse.statusCode).toBe(400)
//     });

//     test('Signup request fails if the username is empty', async () => {
//         const username = "kirat" + Math.random();
//         const password = '123456'

//         const response = axios.post(`${BACKEND_URL}/api/v1/signup`, {
//             password
//         })

//         expect(response.statusCode).toBe(400)

//     })

//     test('Signin succeeds if the username and password are correct', async () => {
//         const username = `kirat-${Math.random()}`
//         const password = '123456'

//         await axios.post(`${BACKEND_URL}/api/v1/user/signup`, {
//             username,
//             password
//         });

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//             username,
//             password
//         })

//         expect(response.statusCode).toBE(200)
//         expect(response.body.token).toBEDefined()

//     })

//     test('Signin fails if the username and password are incorrect', async () => {
//         const username = `kirat-${Math.random()}`
//         const password = '123456'

//         await axios.post(`${BACKEND_URL}/api/v1/signup`, {
//             username,
//             password
//         });

//         const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
//             username: "WrongUsername",
//             password
//         })

//         expect(response.statusCode).toBe(403)
//     })

// })


describe("User metadata endpoints", () => {
  const token = ""
  const avatarId = ""

  beforeAll(async () => {
    const username = `samar-${Math.random()}`
    const password = "123456"

    await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: 'admin'
    })

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    })

    token = response.data.token

    const avatarResponse = await axios.post(`${BACKEND_URL}/api/v1/admin/avatar`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQm3RFDZM21teuCMFYx_AROjt-AzUwDBROFww&s",
      "name": "Timmy"
    })

    avatarId = avatarResponse.data.avatarId;

  })

  test('User cannot update their metadata with a wrong avatar id', async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: "123123123"
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })

    expect(response.statusCode).toBe(400)
  })

  test('User can update their metadata with a avatar Id', async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId: avatarId
    }, {
      headers: {
        "authorization": `Bearer ${token}`
      }
    })

    expect(response.statusCode).toBe(200)
  })

  test("User is not able to update their metadata if the auth header is not present ", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/user/metadata`, {
      avatarId
    })

    expect(response.statusCode).toBe(403)
  })

})


