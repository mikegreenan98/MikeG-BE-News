//

const request = require("supertest");
const app = require("../code/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const { toBeSorted, toBeSortedBy } = require("jest-sorted");

const { convertTimestampToDate } = require("../db/seeds/utils");

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
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          topics: expect.any(Object),
        });
        expect(Array.isArray(data.body.topics)).toBe(true);
      });
  });
  test("that array received has 3 topic objects (as per test data) of format: {slug, description}", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((data) => {
        const topicsArray = data.body.topics;
        expect(topicsArray.length).toBe(3);
        topicsArray.forEach((topic) => {
          expect(topic).toMatchObject({
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
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          articles: expect.any(Object),
        });
        expect(Array.isArray(data.body.articles)).toBe(true);
      });
  });
  test("there are as many articles as those in the test data", () => {
    const numOfArticles = testData.articleData.length;
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        expect(data.body.articles.length).toBe(numOfArticles);
      });
  });
  test("each article has the correct format", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        const articlesArray = data.body.articles;
        articlesArray.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("articles are sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        const articlesArray = data.body.articles;
        expect(articlesArray).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("articles have the correct count of comments", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        // count how many times article 1 is mentioned in the comments data
        const article1Count = testData.commentData.filter(
          (comment) => comment.article_id === 1
        ).length;
        // find article 1 in the data provided from the API
        const articlesArray = data.body.articles;
        const article1 = articlesArray.filter(
          (article) => article.article_id === 1
        )[0];
        // now we can check that article 1's count is same number as the number of times it appears in the test data
        // BEWARE - comment count is a string aso needs the '+' to convert to number
        expect(+article1.comment_count).toBe(article1Count);
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/articles/3").expect(200);
  });
  test("data received in the format {article: []}", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          article: expect.any(Object),
        });
        expect(Array.isArray(data.body.article)).toBe(true);
      });
  });
  test("returns correct article when given a valid and existing article_id", () => {
    return request(app)
      .get("/api/articles/3")
      .expect(200)
      .then((data) => {
        let expectedArticle = {
          author: "icellusedkars",
          title: "Eight pug gifs that remind me of mitch",
          article_id: 3,
          body: "some gifs",
          topic: "mitch",
          created_at: 1604394720000,
          votes: 0,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        };
        expectedArticle = convertTimestampToDate(expectedArticle);
        let articleReceived = convertTimestampToDate(data.body.article[0]);
        expect(articleReceived).toEqual(expectedArticle);
      });
  });
});

describe("GET /api/articles/:article_id error handling", () => {
  test("404 {msg: article not found} is returned when article is not found", () => {
    return request(app)
      .get("/api/articles/7777")
      .expect(404)
      .then((data) => {
        const expected = { msg: "Article not found" };
        expect(data.body).toEqual(expected);
      });
  });
  test("400 {msg: Invalid article} is returned when article is invalid ID", () => {
    return request(app)
      .get("/api/articles/RUBBISH2000")
      .expect(400)
      .then((data) => {
        const expected = { msg: "Invalid article was provided by client" };
        expect(data.body).toEqual(expected);
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200 status code received when calling api correctly", () => {
    return request(app).get("/api/articles/1/comments").expect(200);
  });
  test("data received in the format {comments: []}", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          comments: expect.any(Object),
        });
        expect(Array.isArray(data.body.comments)).toBe(true);
      });
  });
  test("returns correct number of comments for a valid article_id", () => {
    return request(app)
      .get("/api/articles/5/comments")
      .expect(200)
      .then((data) => {
        let commentsReceived = data.body.comments;
        expect(commentsReceived.length).toEqual(2);
      });
  });
  test("comments are provided in descending order - most recent first", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then((data) => {
        let commentsReceived = data.body.comments;
        expect(commentsReceived).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("comment objects are in correct format", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((data) => {
        const commentsReceived = data.body.comments;
        commentsReceived.forEach((comment) => {
          let newComment = convertTimestampToDate(comment);
          expect(newComment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            article_id: expect.any(Number),
            author: expect.any(String),
            votes: expect.any(Number),
            created_at: expect.any(Date),
          });
        });
      });
  });
});



describe("GET /api/articles/:article_id/comments --- error handling", () => {
  test("400 {msg: Invalid article} is returned when article is invalid ID", () => {
    return request(app)
      .get("/api/articles/BAD_ID_9000/comments")
      .expect(400)
      .then((data) => {
        const expected = { msg: "Invalid article provided by client - not possible to search comments" };
        expect(data.body).toEqual(expected);
      });
  });
  test("404 {msg: article not found} is returned when article is not found", () => {
    return request(app)
      .get("/api/articles/888/comments")
      .expect(404)
      .then((data) => {
        const expected = { msg: "Article not found" };
        expect(data.body).toEqual(expected);
      });
  });

  test("200 and empty array are returned when the given article_id exists but no comments for that article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then((data) => {
        const expected = { comments: []};
        expect(data.body).toEqual(expected);
      });
  });


});


// describe('Tests for general SQL errors', () => {
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
// });
