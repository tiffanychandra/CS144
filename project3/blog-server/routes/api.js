var express = require("express");
var router = express.Router();
var connectDatabase = require("../connectDatabase");
var jwt = require("jsonwebtoken");
var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";
// Blog Management REST API
/*
All dates transmitted should be in milliseconds since the the Unix epoch (Jan 1, 1970 UTC) in number type.

If a request does not meet our requirements (such as not formatting data in JSON, not including required data, etc.), the server must reply with “400 (Bad request)” status code.

This REST API must be protected behind authentication. That is, if the request to this API does not contain a valid jwt cookie with matching username (i.e., if the jwt cookie is not included in the HTTP header, 
if the included jwt has expired, or if the username in jwt does not match the username in the URL), the server must reply with “401 (Unauthorized)” status code.
*/
router.get("/:username", async function (req, res, next) {
  try {
    // return all blog posts by username & check fields in post
    let db = connectDatabase.connection();
    let posts = db.collection("Posts");
    let docs = await posts
      .find({
        username: req.params.username,
        postid: { $exists: true },
        title: { $exists: true },
        body: { $exists: true },
        created: { $exists: true },
        modified: { $exists: true },
      })
      .toArray();
    // return response body as json array
    res.json(docs);
  } catch (e) {
    return next(e);
  }
});
module.exports = router;
