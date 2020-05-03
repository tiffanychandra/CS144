var express = require("express");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var connectDatabase = require("../connectDatabase");
var router = express.Router();
var assert = require("assert");
var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

/* GET /login with optional redirect parameter 
 server should return an HTML page that contains an HTML form with at least two input fields, username and password
 username=:username&password=:password&redirect=:redirect */

router.get("/", function (req, res) {
  let redirect = "";
  if (req.query.redirect) redirect = req.query.redirect;
  res.render("login", {
    username: "",
    password: "",
    redirect: redirect,
  });
});

/* POST login page*/
router.post("/", function (req, res) {
  let db = connectDatabase.connection();
  let users = db.collection("Users");
  if (req.body.username == null || req.body.password == null) {
    res.sendStatus(404); // request body must contain username and password
  }

  users.findOne({ username: req.body.username }, async function (err, docs) {
    assert.equal(err, null);
    let auth;
    if (docs == null) auth = false;
    else auth = await bcrypt.compare(req.body.password, docs.password);
    if (auth) {
      // set an authentication session cookie
      var token = jwt.sign(
        { usr: req.body.username, exp: Math.floor(Date.now() / 1000) + 7200 },
        key,
        { header: { alg: "HS256", typ: "JWT" } }
      );
      res.cookie("jwt", token);
      if (req.body.redirect != null) res.redirect(req.body.redirect);
      else {
        res.status(200).json({
          message: "Login successful",
        });
      }
      // redirect to redirect if provided or return status code 200
    }
    // otherwise send status code 401 and html form with
    else {
      res.status(401).render("login", {
        username: req.body.username,
        password: req.body.password,
        redirect: "",
      });
    }
  });
});
module.exports = router;
