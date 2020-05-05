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

// if input requirements are bad, return 400
// request body should be in JSON
// REST API must be protected behind authentication

// GET /api/:username
// response code should be 200
router.get("/:username", async function (req, res, next) {
  try {
    // return all blog posts by username & check fields in post
    if (authenticate(req, res) && checkRequest(req, res, method)) {
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
    }
  } catch (e) {
    return next(e);
  }
});

// GET /api/:username/:postid
// response code should be 200 if post exists, 404 (not found) otherwise
router.get("/:username/:postid", async function (req, res, next) {
  try {
    // return all blog posts by username & check fields in post
    if (authenticate(req, res) && checkRequest(req, res, method)) {
      let db = connectDatabase.connection();
      let posts = db.collection("Posts");
      let docs = await posts.findOne({
        username: req.params.username,
        postid: parseInt(req.params.postid),
        title: { $exists: true },
        body: { $exists: true },
        created: { $exists: true },
        modified: { $exists: true },
      });
      if (docs) res.json(docs);
      else res.status(404).json(docs);
    }
  } catch (e) {
    return next(e);
  }
});

// POST /api/:username/:postid
// repsonse code should be 201 if post created, 400 (bad request) otherwise
router.post("/:username/:postid", async function (req, res, next) {
  try {
    if (authenticate(req, res) && checkRequest(req, res, method)) {
      let db = connectDatabase.connection();
      let docs = await posts.findOne({
        username: req.params.username,
        postid: parseInt(req.params.postid),
      });
      // bad request, post already exists
      if (docs) {
        res.status(400).json(docs);
      }

      // add new post and return status = 201
      else {
        await connection.collection("Posts").insertOne({
          username: req.params.username,
          postid: parseInt(req.params.postid),
          title: req.body.title,
          body: req.body.body,
          created: Date.now(),
          modified: Date.now(),
        });
        res.status(201).json(docs);
      }
    }
  } catch (e) {
    return next(e);
  }
});

// PUT /api/:username/:postid
// response code should be 200 of successful update, 400 (bad request) otherwise
router.put("/:username/:postid", async function (req, res, next) {
  try {
    if (authenticate(req, res) && checkRequest(req, res, method)) {
      let db = connectDatabase.connection();
      let docs = await posts.updateOne(
        {
          username: req.params.username,
          postid: parseInt(req.params.postid),
        },
        {
          $set: {
            title: req.body.title,
            body: req.body.body,
          },
        }
      );
      res.status(200).json(docs);
    }
  } catch (e) {
    return next(e);
  }
});

// DELETE /api/:username/:postid
// response code should be 204 if successful deletion, 400 (bad request) otherwise
router.delete("/:username/:postid", async function (req, res, next) {
  try {
    if (authenticate(req, res) && checkRequest(req, res, method)) {
      let db = connectDatabase.connection();
      let docs = await posts.deleteOne({
        username: req.params.username,
        postid: parseInt(req.params.postid),
      });
      if (docs.deletedCount == 1) {
        res.status(204).json(docs);
      } else {
        // post does not exist
        res.status(400).json(docs);
      }
    }
  } catch (e) {
    return next(e);
  }
});

function checkRequest(req, res, method) {
  // If a request does not meet our requirements (such as not formatting data in JSON, not including required data, etc.), the server must reply with “400 (Bad request)” status code.
  if (method == "GET" && !req.params.postid) {
    res.sendStatus(400);
    return false;
  } else if (method == "POST" || method == "PUT") {
    if (
      !req.headers["content-type"] ||
      type.indexOf("application/json") !== 0
    ) {
      res.sendStatus(400);
      return false;
    }
    if (req.body.title == null || req.body.body == null) {
      res.sendStatus(400);
      return false;
    }
  }
  return true;
}

function authenticate(req, res) {
  let token = req.cookies.jwt;
  let auth;
  if (!token) {
    res.sendStatus(401);
    return false;
  }
  try {
    auth = jwt.verify(token, key);
  } catch (e) {
    res.sendStatus(401);
    return false;
  }
  if (auth.exp <= Math.floor(Date.now() / 1000)) {
    res.sendStatus(401);
    return false;
  } else if (auth.usr != req.params.username) {
    res.sendStatus(401);
    return false;
  }
  return true;
}

module.exports = router;
