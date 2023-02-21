//

const request = require("supertest");
const app = require('../code/app');
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");

beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  db.end();
});

describe("GET /api/topics test suite", () => {
  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/topics").expect(200);
  });

  test("data received in the format {topics: []}", () => {
    return request(app).get("/api/topics").expect(200)
    .then((data) => {
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




describe("GET /api/articles test suite", () => {
  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/articles").expect(200);
  });

  test("data received in the format {articles: []}", () => {
    return request(app).get("/api/articles").expect(200)
    .then((data) => {
      expect(data.body).toMatchObject({
        articles: expect.any(Object),
      });
      expect(Array.isArray(data.body.articles)).toBe(true);
    });
  });

  test("there are as many articles as those in the test data", () => {
    const numOfArticles = testData.articleData.length;
    return request(app).get("/api/articles").expect(200)
    .then((data) => {
      expect(data.body.articles.length).toBe(numOfArticles);
    });
  });

  test('each article has the correct format', () => {
    return request(app).get("/api/articles").expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      articlesArray.forEach((article) => {
        expect (article).toMatchObject({
          author: expect.any(String),
          title: expect.any(String),
          article_id: expect.any(Number),
          topic: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url:expect.any(String),
          comment_count: expect.any(String),
        });
      });
    });
  });


  test('articles are sorted by date in descending order', () => {
    return request(app).get("/api/articles").expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      let correctOrder = true;
      let i = 1;
      while (correctOrder && i < articlesArray.length){
        correctOrder = articlesArray[i-1].created_at > articlesArray[i].created_at;
        i++;
      }
      expect(correctOrder).toBe(true);
    });
  });

  test('articles have the correct count of comments', () => {
    return request(app).get("/api/articles").expect(200)
    .then((data) => {
      
      // count how many times article 1 is mentioned in the comments data
      const article1Count = testData.commentData.filter(comment => comment.article_id === 1).length;

      // find article 1 in the data provided from the API
      const articlesArray = data.body.articles;
      const article1 = articlesArray.filter(article => article.article_id === 1)[0];

      // now we can check that article 1's count is same number as the number of times it appears in the test data
      // BEWARE - comment count is a string aso needs the '+' to convert to number
      expect(+article1.comment_count).toBe(article1Count);
    });
  });
});
