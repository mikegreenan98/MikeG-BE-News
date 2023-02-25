
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
        const expected = {
          msg: "Invalid article provided by client - not possible to search comments",
        };
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
        const expected = { comments: [] };
        expect(data.body).toEqual(expected);
      });
  });
});



describe("PATCH /api/articles/:article_id", () => {
  const validInput77 = { inc_votes: 77 };

  test("200 status code received when calling api correctly", () => {
    return request(app).patch("/api/articles/1").send(validInput77).expect(200);
  });

  test("data received in the format {article: [{}]} with a single object in the array when input body is valid", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(validInput77)
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          article: expect.any(Object),
        });
        expect(Array.isArray(data.body.article)).toBe(true);
        expect(data.body.article.length).toBe(1);
      });
  });

  test("article received is valid article format", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(validInput77)
      .expect(200)
      .then((data) => {
        expect(data.body.article[0]).toMatchObject({
          article_id: expect.any(Number),
          title: expect.any(String),
          topic: expect.any(String),
          author: expect.any(String),
          body: expect.any(String),
          created_at: expect.any(String),
          votes: expect.any(Number),
          article_img_url: expect.any(String),
        });
      });
  });

  test("The article's votes is increased by the provided inc_votes in the body of users message", () => {
    return request(app)
      .patch("/api/articles/1")
      .send(validInput77)
      .expect(200)
      .then((data) => {
        expect(data.body.article[0].votes).toBe(100 + 77); //article 1 in test data is 100 at seed point
      });
  });
});

describe("PATCH /api/articles/:article_id --- error handling", () => {
  const validInput88 = { inc_votes: 88 };

  test("400 and {msg: Bad Request - no inc_votes provided} are returned when inc_votes not present", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ INC_VOTES_MISPELT: 22 })
      .expect(400)
      .then((data) => {
        const expected = { msg: "Bad Request - no inc_votes provided" };
        expect(data.body).toEqual(expected);
      });
  });

  test("400 and {msg: Bad Request - inc_votes must be an integer} are returned when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "NOT A NUMBER" })
      .expect(400)
      .then((data) => {
        const expected = { msg: "Bad Request - inc_votes must be an integer" };
        expect(data.body).toEqual(expected);
      });
  });

  test("404 {msg: article not found} is returned when article is not found", () => {
    return request(app)
      .patch("/api/articles/100000")
      .send(validInput88)
      .expect(404)
      .then((data) => {
        const expected = { msg: "Article not found" };
        expect(data.body).toEqual(expected);
      });
  });
  test("400 {msg: Invalid article} is returned when article is invalid ID", () => {
    return request(app)
      .patch("/api/articles/RUBBISH2000")
      .send(validInput88)
      .expect(400)
      .then((data) => {
        const expected = { msg: "Bad Request - article_id must be an integer" };
        expect(data.body).toEqual(expected);
      });
  });
});


// ======== 07 ==========

describe("POST /api/articles/:article_id/comments", () => {
  const validInput = { username: "lurker", body: "a valid body" };

  test("201 status code received when calling api correctly", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(validInput)
      .expect(201);
  });

  test("returns a single comment object in the format {comment: [{comment-obj}]}", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(validInput)
      .expect(201)
      .then((data) => {
        expect(data.body).toMatchObject({
          comment: expect.any(Object),
        });
        expect(Array.isArray(data.body.comment)).toBe(true);
        expect(data.body.comment.length).toBe(1);
      });
  });

  test("comment returned is valid format", () => {
    return request(app)
      .post("/api/articles/2/comments")
      .send(validInput)
      .expect(201)
      .then((data) => {
        expect(data.body.comment[0]).toMatchObject({
          comment_id: expect.any(Number),
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
        expect(data.body.comment[0].article_id).toBe(2);
      });
  });

  test("comment returned is constructed as expected", () => {
    let expectedComment = {
      comment_id: 19, //test data is 18 long
      body: "a valid body",
      article_id: 10,
      author: "lurker",
      votes: 0,
      // created_at: //this will be DEFAULT NOW() so not testable
    };
    return request(app)
      .post("/api/articles/10/comments")
      .send(validInput)
      .expect(201)
      .then((data) => {
        expect(data.body.comment[0].comment_id).toEqual(
          expectedComment.comment_id
        );
        expect(data.body.comment[0].body).toEqual(expectedComment.body);
        expect(data.body.comment[0].article_id).toEqual(
          expectedComment.article_id
        );
        expect(data.body.comment[0].author).toEqual(expectedComment.author);
        expect(data.body.comment[0].votes).toEqual(expectedComment.votes);
      });
  });
});

describe("POST /api/articles/:article_id/comments - error handling", () => {
  const validInput = { username: "lurker", body: "a valid body" };

  test("when username provided is not in users DB, return 404 - Not found", () => {
  const badInput = { username: "FREDDIE", body: "a valid body" };
    return request(app)
      .post("/api/articles/2/comments")
      .send(badInput)
      .expect(404)
      .then((data) => {
        const expected = { msg: "Not found" };
        expect(data.body).toEqual(expected);
      });
  });

  test("when article_id not an integer - returns a Bad request error", () => {
    return request(app)
      .post("/api/articles/BAD_ID_9000/comments")
      .send(validInput)
      .expect(400)
      .then((data) => {
        const expected = {
          // msg: "Invalid article was provided by client",
          msg: "Bad request",
        };
        expect(data.body).toEqual(expected);
      });
  });

  test("404 {msg: Not found} returned when article is not present in the db", () => {
    return request(app)
      .post("/api/articles/888/comments")
      .send(validInput)
      .expect(404)
      .then((data) => {
        const expected = { msg: "Not found" };
        expect(data.body).toEqual(expected);
      });
  });
});

// ====== 09 ========
describe("GET /api/users test suite", () => {
  test("200 status code received when calling correct api", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("data received in the format {users: []}", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((data) => {
        expect(data.body).toMatchObject({
          users: expect.any(Object),
        });
        expect(Array.isArray(data.body.users)).toBe(true);
      });
  });
  test("array received has 4 users which are taken from the test data, and in correct format", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((data) => {
        const usersArray = data.body.users;
        expect(usersArray.length).toBe(4);
        usersArray.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

// ========= 10 =========

describe("GET with ORDER: /api/articles?order=", () => {
  
  test("when no order query provided, articles are sorted in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("created_at", { descending: true });
    });
  });
  
  test("if 'ASC' is provided the default 'DESC' order is reversed", () => {
    return request(app)
    .get("/api/articles?order=ASC")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("created_at", { ascending: true });
    });
  });
  
  test("if 'DESC' is provided, then same as default, order ascending", () => {
    return request(app)
    .get("/api/articles?order=DESC")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("created_at", { descending: true });
    });
  });

  test("if order=BAD_REQUEST then a 400 Bad request is received", () => {
    return request(app)
    .get("/api/articles?order=BAD_REQUEST")
    .expect(400)
    .then((data) => {
      expect(data.body).toEqual({ msg: "Bad Request - Invalid query order= was provided" });
    });
  });
});

describe("GET with SORT_BY: /api/articles?sort_by= , also, with ORDER= combo", () => {
  
  test("when no sort_by query provided, articles are sorted by date descending", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("created_at", { descending: true });
    });
  });

  test("when sort_by=author is provided, returned data is sorted by author descending", () => {
    return request(app)
    .get("/api/articles?sort_by=author")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("author", { descending: true });
    });
  });
  
  test("when we get 'sort_by=title&order=ASC', returned data is sorted by title ascending", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order=ASC")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("title", { ascending: true });
    });
  });
  
  test("when we get 'order=ASC&sort_by=votes', returned data is sorted by votes ascending", () => {
    return request(app)
    .get("/api/articles?order=ASC&sort_by=votes")
    .expect(200)
    .then((data) => {
      const articlesArray = data.body.articles;
      expect(articlesArray).toBeSortedBy("votes", { ascending: true });
    });
  });

  test("if sort_by=BAD_REQUEST then a 400 Bad request is received", () => {
    return request(app)
    .get("/api/articles?sort_by=BAD_REQUEST77")
    .expect(400)
    .then((data) => {
      expect(data.body).toEqual({ msg: "Bad Request - Invalid query sort_by= was provided" });
    });
  });
});

// NOTES on test data:
// 'mitch' or 'cats' or 'paper' are the 3 topics in the topics db
// in articles the hits for those are mitch(11), cats(1), paper(0)
describe("GET with TOPIC=: /api/articles?topic=", () => {
  test("when topic is omitted - returns all 12 articles in the db", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((data) => {
        expect(data.body.articles.length).toEqual(12);
      });
  });

  test("topic = mitch returns 11 articles", () => {
    return request(app)
      .get("/api/articles?topic=mitch")
      .expect(200)
      .then((data) => {
        const articlesArray = data.body.articles;
        expect(articlesArray.length).toEqual(11);
        expect(articlesArray[3].topic).toEqual('mitch');
        const mitchArray = articlesArray.filter(item => item.topic === 'mitch');
        expect(mitchArray.length).toEqual(11);
      });  
    });    
    
    test("topic = paper returns zero articles - but is still a 200 status code and not an error", () => {
      return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((data) => {
        expect(data.body.articles.length).toEqual(0);
      });  
    });    
    
    test("all 3 queries work together: ?topic=mitch&order=ASC&sort_by=votes  ====>  11 articles sorted by votes in ascending order", () => {
      return request(app)
      .get("/api/articles?topic=mitch&order=ASC&sort_by=votes")
      .expect(200)
      .then((data) => {
        const articlesArray = data.body.articles;
        expect(articlesArray.length).toEqual(11);
        expect(articlesArray).toBeSortedBy("votes", { ascending: true });
      });  
    });    
    
    // test.only("when topic is not in the db, get an empty array and 200 status code", () => {
    //   return request(app)
    //   .get("/api/articles?topic=A_TOPIC_NOT_IN_DB")
    //   .expect(200)
    //   .then((data) => {
    //     expect(data.body.articles.length).toEqual(0);
    //   });
    // });

    test("when topic is not in the db, get 404", () => {
      return request(app)
      .get("/api/articles?topic=A_TOPIC_NOT_IN_DB")
      .expect(404)
      .then((data) => {
      expect(data.body).toEqual({ msg: "Not found - the topic does not exist" });
      });
    });
});

describe('/api/', () => {
  test('reads the api.json file', () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((data) => {
        expect(typeof data.body).toBe('object');
        console.log(data.text);
      });
  });
});
