var express = require("express");
var router = express.Router();
var bcryptjs = require("bcryptjs");
let jwt = require("jsonwebtoken");
var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

/* GET /login with optional redirect parameter 
 server should return an HTML page that contains an HTML form with at least two input fields, username and password
 username=:username&password=:password&redirect=:redirect */

router.get('/', function(req, res) {
	let redirect = "";
	if (req.query.redirect) redirect = req.query.redirect;
    res.render("login", {
        "username": "",
        "password": "",
        "redirect": redirect
    });
})

module.exports = router;