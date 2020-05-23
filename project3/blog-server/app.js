var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var assert = require("assert");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var blogRouter = require("./routes/blog");
var loginRouter = require("./routes/login");
var apiRouter = require("./routes/api");
var key = "C-UFRaksvPKhx1txJYFcut3QGxsafPmwCY6SCly3G6c";

var connectDatabase = require("./connectDatabase");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.set("key", key);

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// authentication
var jwt = require("jsonwebtoken");
app.all("/editor*", function (req, res, next) {
  var token =
    req.cookies.jwt ||
    req.body.token ||
    req.query.token ||
    req.headers["x-access-token"];
  jwt.verify(token, req.app.get("key"), function (err) {
    if (err) {
      res.redirect("/login?redirect=/editor/");
    } else {
      next();
    }
  });
});
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/blog", blogRouter);
app.use("/login", loginRouter);
app.use("/api", apiRouter);

// connect to database
connectDatabase.init(function (err) {
  assert.equal(null, err);
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
