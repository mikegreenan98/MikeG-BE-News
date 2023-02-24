
\c nc_news_test

-- SELECT articles.author, title, articles.article_id, topic,
-- articles.created_at, articles.votes, article_img_url,
-- COUNT (comments.comment_id) AS comment_count
-- FROM articles
-- LEFT OUTER JOIN comments
-- ON comments.article_id = articles.article_id
-- GROUP BY articles.article_id
-- ORDER BY created_at DESC;

-- SELECT * FROM articles;

-- SELECT title, articles.article_id, COUNT (comments.comment_id) AS comment_count
-- FROM articles
-- LEFT OUTER JOIN comments
-- ON comments.article_id = articles.article_id
-- GROUP BY articles.article_id;

-- SELECT * FROM comments;


-- INSERT INTO comments
-- (body, author, article_id, votes, created_at) 
-- VALUES
-- ('body77','author77',77,66);

-- INSERT INTO comments
-- (body, author, article_id, votes) 
-- VALUES
-- ('body77','lurker',2,77)
-- RETURNING *;

SELECT articles.author, title, articles.article_id, topic,
articles.created_at, articles.votes, article_img_url,
COUNT (comments.comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments
ON comments.article_id = articles.article_id
WHERE articles.topic = 'mitch'
GROUP BY articles.article_id
ORDER BY created_at DESC;



