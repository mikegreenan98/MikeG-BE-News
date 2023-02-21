
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

SELECT title, articles.article_id, COUNT (comments.comment_id) AS comment_count
FROM articles
LEFT OUTER JOIN comments
ON comments.article_id = articles.article_id
GROUP BY articles.article_id;



