const app = require('./app');
const supertest = require("supertest");
const request = supertest(app);
// let nock = require('nock');




// Supertest end points.



describe("TESTING GET ENDPOINTS", () => {

  expectedOutput = {
      "original_url": "https://www.gotchacap.com/",
      "shorten_url": "testMe:)",
      "createdAt": "2021-03-05 16:00:29",
      "clicks": 0
  };

  it("Testing reset database", async () => {
    const response = await request.get('/reset/666');
    expect(response.status).toBe(200);
  });

  it("Testing get statistic",async () => {
    const response = await request.get('/api/statistic/testMe:)');
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expectedOutput);
  });

  it("Testing redirection", async () => {
    const response = await request.get('/testMe:)');
    expect(response.status).toBe(303);
  });


});



// gets in to the server as an empty object
describe("TESTING POST ENDPOINT CORRECT STATUS", () => {

  expectedData = {
    "original_url": "https://github.com/benhanover?tab=repositories",
    "shorten_url": "zPGHU"
  }

  it("Should save user to the database", async () => {
    const res = await request.post('/api/shorturl/new')
    .send({
      url: "https://github.com/benhanover?tab=repositories"
    })
    .type('form'); // other wise it gets to the server as an empty object
      expect(res.status).toBe(200);
      // expect(res.body).toBe(expectedData); //changing the shorten url id
  });
});

describe("TESTING POST VALID URL", () => {
  it("should reject unvalid url", async () => {
    const res = await request.post('/api/shorturl/new')
    .send({
      url: "www.google.com"
    })
    .type('form');
    expect(res.status).toBe(400);
  });
});

describe("TESTING THE USER URL NAME", () => {
  it("should reject used id", async () => {
    const res = await request.post('/api/shorturl/new')
    .send({
      url: "https://www.convertonline.io/convert/js-to-json",
      askedShorten: "testMe:)"
    })
    .type('form');
    expect(res.body).toStrictEqual({error: "name is already taken"});
  });
});



app.listen(3000, () => {console.log("Testing on port 3000")});



