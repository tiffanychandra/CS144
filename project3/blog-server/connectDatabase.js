const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// connection URL
const url = 'mongodb://localhost:27017/BlogServer';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected successfully to BlogServer");
  db.close();
});

let express = require('express');
let MongoClient = require('mongodb').MongoClient;
let app = express();

const MONGODB_URI = 'mongo-uri';
let db;

// Initialize connection once, reuse the database object 

MongoClient.connect(MONGODB_URI, function(err, database) {
  db = database;
  app.listen(3000);
  console.log('Listening on port 3000');
});

app.get('/', function(req, res) { 
  db.collection('test').find({}, function(err, docs) {
    docs.each(function(err, doc) {
      if(doc) {
        res.write(JSON.stringify(doc) + "n");
      } else {
        res.end();
      }
    });
  });
});

app.get('/post', function(req, res) {
  db.collection('test').insert({ docid: Math.random() }, function(err) {
    res.end('Successful Insert!');
  })
});