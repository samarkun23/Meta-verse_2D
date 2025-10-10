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

describe('user avatar information', () => {
  let avatarId;
  let token;
  let userId;

  beforeAll(async () => {
    const username = `samar-${Math.random()}`
    const password = "123456"

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: 'admin'
    });

    userId = signupResponse.data.userId;

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

  test("Get back avatar information for a user", async () => {
    const response = axios.get(`${BACKEND_URL}/api/v1/user/metadata/bulk?ids= ${userId}`);

    expect(response.data.avatar).toBe(1);

    expect(response.data.avatar[0].userId).toBe(userId);
  })

  test("Available avatars lists the recently created avatar", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/avatars`)

    expect(response.data.avatars.length).nottoBe(0)
    const currentAvatar = response.data.avatar.find(x => x.id == avatarId);
    expect(currentAvatar).toBEDefined();
  })



})

describe("Space information", () => {
  let mapId;
  let element1Id;
  let element2Id;
  let adminToken;
  let adminId;
  let userToken;
  let userId;

  beforeAll(async () => {
    const username = `samar-${Math.random()}`
    const password = "123456"

    const signupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: 'admin'
    });

    adminId = signupResponse.data.userId;

    const response = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    })

    adminToken = response.data.token;

    // user signin and singup
    const usersignupResponse = await axios.post(`${BACKEND_URL}/api/v1/signup`, {
      username,
      password,
      type: 'admin'
    });


    userId = usersignupResponse.data.userId;

    const userSignInResponse = await axios.post(`${BACKEND_URL}/api/v1/signin`, {
      username,
      password
    })

    userToken = userSignInResponse.data.token;


    //creating the element

    const element1 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true

    }, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })

    const element2 = await axios.post(`${BACKEND_URL}/api/v1/admin/element`, {
      "imageUrl": "https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRCRca3wAR4zjPPTzeIY9rSwbbqB6bB2hVkoTXN4eerXOIkJTG1GpZ9ZqSGYafQPToWy_JTcmV5RHXsAsWQC3tKnMlH_CsibsSZ5oJtbakq&usqp=CAE",
      "width": 1,
      "height": 1,
      "static": true

    }, {
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    })

    element1Id = element1.id;
    element2Id = element2.id;

    const map = await axios.post(`${BACKEND_URL}/api/v1/admin/map`, {

      "thumbnail": "https://thumbnail.com/a.png",
      "dimensions": "100x200",
      "name": "100 person interview room",
      "defaultElements": [{
        elementId: element1Id,
        x: 20,
        y: 20
      }, {
        elementId: element1Id,
        x: 18,
        y: 20
      }, {
        elementId: element2Id,
        x: 19,
        y: 20
      }]
    }, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })
    mapId = map.id

  });

  test("User able to create a space", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
      "mapId": mapId
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.spaceId).toBeDefined()
  })

  test("User is able to create a space without mapId (empty space)", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimenstions": "100x200"
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    }
    )

    expect(response.spaceId).toBeDefined()
  })

  test(`User is not able to create a space without mapId and dimensions`, async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "test",
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    }
    )

    expect(response.statusCode).toBe(400)

  })

  //delete the sapace 
  test("User delete the space that doesnt exist", async () => {
    const response = await axios.delete(`${BACKEND_URL}/api/v1/space/randomIdDoesntExist`, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(response.statusCode).toBe(400);
  })

  test("User is able to delete a space that does exist ", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const deleteRespose = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    expect(deleteRespose.statusCode).toBe(200);
  })

  test("User is not able to delete a space created by another user", async () => {
    const response = await axios.post(`${BACKEND_URL}/api/v1/space`, {
      "name": "Test",
      "dimensions": "100x200",
    }, {
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })

    const deleteRespose = await axios.delete(`${BACKEND_URL}/api/v1/space/${response.data.spaceId}`, {
      headers: {
        authorization: `Bearer ${adminToken}`
      }
    })

    expect(deleteRespose.statusCode).toBe(400);
  })

  //get my existing spaces
})


