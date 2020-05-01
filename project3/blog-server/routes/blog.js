var express = require("express");
var router = express.Router();
var commonmark = require("commonmark");
var connectDatabase = require("../connectDatabase");

/* GET first five posts of user with optional query string parameter start=:postid */
router.get("/:username", function (req, res, next) {
  res.render("posts", { username: req.params.username });
});

/* Get one post with id=postid by user=username */
router.get("/:username/:postid", function (req, res) {
	res.render("posts", { postid: req.params.postid, username: req.params.username });
});

module.exports = router;
