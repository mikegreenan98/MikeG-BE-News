//

const request = require("supertest");
const app = require('../code/app');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index");
const { convertTimestampToDate } = require("../db/seeds/utils");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  db.end();
});



describe("GET /api/topics", () => {

  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("data received in the format {topics: []}", () => {
    return request(app).get("/api/topics").expect(200)
    .then((data) => {
      console.log(data.body);
      expect(data.body).toMatchObject({
        topics: expect.any(Object),
      });
      expect(Array.isArray(data.body.topics)).toBe(true);
    });
  });

  test('that array received has 3 topic objects (as per test data) of format: {slug, description}', () => {
    return request(app).get("/api/topics").expect(200)
    .then((data) => {
      const topicsArray = data.body.topics;
      expect(topicsArray.length).toBe(3);
      topicsArray.forEach((topic) => {
        expect (topic).toMatchObject({
          slug: expect.any(String),
          description: expect.any(String),
        });
      });
    });
  });
});

describe('GET /api/articles/:article_id', () => {
  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/articles/3").expect(200);
  });
  test("data received in the format {article: []}", () => {
    return request(app).get("/api/articles/1").expect(200)
    .then((data) => {
      expect(data.body).toMatchObject({
        article: expect.any(Object),
      });
      expect(Array.isArray(data.body.article)).toBe(true);
    });
  });
  test("returns correct article when given a valid and existing article_id", () => {
    return request(app).get("/api/articles/3").expect(200)
    .then((data) => {
      let expectedArticle = {
        author: 'icellusedkars',
        title: 'Eight pug gifs that remind me of mitch',
        article_id: 3,
        body: 'some gifs',
        topic: 'mitch',
        created_at: 1604394720000,
        votes: 0,
        article_img_url:
          'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
      };
      expectedArticle = convertTimestampToDate(expectedArticle);
      let articleReceived = convertTimestampToDate(data.body.article[0]);
      expect(articleReceived).toEqual(expectedArticle);
    });
  });
});

describe('GET /api/articles/:article_id error handling', () => {
  test("404 {msg: article not found} is returned when article is not found", () => {
    return request(app).get("/api/articles/7777").expect(404)
    .then((data) => {
      const expected = {msg: "Article not found"};
      expect(data.body).toEqual(expected);
    });
  });
  test("400 {msg: Invalid article} is returned when article is invalid ID", () => {
    return request(app).get("/api/articles/RUBBISH2000").expect(400)
    .then((data) => {
      const expected = {msg: "Invalid article was provided by client"};
      expect(data.body).toEqual(expected);
    });
  });
});

describe('Tests for general SQL errors', () => {
  
  //BELOW DOES NOW WORK - NEED HELP TO UNDERSTAND WEHY NOT??
  
  // test.only("SQL error", () => {
  //   return db.query(`DROP TABLE IF EXISTS articles;`)
  //   .then(() => {
  //     return request(app).get("/api/articles/3").expect(500)
  //     .then((data) => {
  //       const expected = {msg: "Server error"};
  //       expect(data.body).toEqual(expected);
  //   });
  // });
  // });

});