//

const request = require("supertest");
// const app = require('../code/app');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics", () => {

  // test("200 status code received when calling correct api", () => {
  //   return request(app).get("/api/topics").expect(200);
  // });

  // test("data received in the format {topics: []}", () => {
  //   return request(app).get("/api/topics").expect(200)
  //   .then((data) => {
  //     console.log(data.body);
  //     expect(data.body).toMatchObject({
  //       topics: expect.any(Object),
  //     });
  //     expect(Array.isArray(data.body.topics)).toBe(true);
  //   });
  // });

  // test('that array received has 3 topic objects (as per test data) of format: {slug, description}', () => {
  //   return request(app).get("/api/topics").expect(200)
  //   .then((data) => {
  //     const topicsArray = data.body.topics;
  //     expect(topicsArray.length).toBe(3);
  //     topicsArray.forEach((topic) => {
  //       expect (topic).toMatchObject({
  //         slug: expect.any(String),
  //         description: expect.any(String),
  //       });
  //     });
  //   });
  // });

test('', () => {
  
});

  
});
