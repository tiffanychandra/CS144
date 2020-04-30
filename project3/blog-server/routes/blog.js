var express = require("express");
var router = express.Router();
var commonmark = require("commonmark");
var connectDatabase = require("../connectDatabase");
var assert = require("assert");

/* GET first five posts belonging with :username with optional query string parameter start=:postid 
   When there are more posts from the user the returned page must contain a “next” link, which points to a page with the next 5 posts according to the postid by the user. */
router.get("/:username", function (req, res) {
  let db = connectDatabase.connection();
  let posts = db.collection("Posts");
  let start;
  if (req.query.start) start = parseInt(req.query.start);
  else start = 1;
  posts
    .find({
      $and: [{ username: req.params.username }, { postid: { $gte: start } }],
    })
    .sort({ postid: 1 })
    .toArray(function (err, docs) {
      assert.equal(err, null);
      if (docs.length == 0) {
        res.sendStatus(404);
        return;
      }
      let next_start = docs.length > 5 ? start + 5 : 0;
      let resultPage = docs.slice(0, 5);

      let reader = new commonmark.Parser();
      let writer = new commonmark.HtmlRenderer();
      for (let post of resultPage) {
        let titleParsed = reader.parse(post.title);
        post.titleHTML = writer.render(titleParsed);
        let bodyParsed = reader.parse(post.body);
        post.bodyHTML = writer.render(bodyParsed);
      }

      res.render("posts", {
        username: req.params.username,
        posts: resultPage,
        next_start: next_start,
      });
    });
});

module.exports = router;
