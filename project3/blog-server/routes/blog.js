var express = require("express");
var router = express.Router();
var commonmark = require("commonmark");
var connectDatabase = require("../connectDatabase");

/* GET first five posts of user with optional query string parameter start=:postid */
router.get("/:username", function (req, res, next) {
  res.render("posts", { username: req.params.username });
});

module.exports = router;
