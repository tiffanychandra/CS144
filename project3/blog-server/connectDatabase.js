const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");

// connection URL
const url = "mongodb://localhost:27017";

// Use connect method to connect to the server
let db;

module.exports.init = function (callback) {
  if (db) {
    console.log("Connection established");
  }
  MongoClient.connect(url, function (err, database) {
    assert.equal(null, err);
    console.log("Connected successfully to BlogServer");
    db = database.db("BlogServer");
    return callback(err);
  });
};

module.exports.connection = function () {
  assert.ok(db, "Connection to database has not been established");
  return db;
};
