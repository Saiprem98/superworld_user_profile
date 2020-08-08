var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();
var assert = require('assert');
const dbName = 'test';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://HK_superworld:BugfexRacfJjG7y@superworldvna.gxlyf.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/* Display data .find() */
router.get('/get-data', function(req, res, next){
  var resultArray = [];
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    const db = client.db(dbName);
    var cursor = db.collection('user-data').find();
    cursor.forEach(function(doc, err) {
        assert.equal(null, err);
        resultArray.push(doc);
    }, function(){
      client.close();
      res.render('index', {items: resultArray});
    });
  });
});


/* Insert data .insertOne() */
router.post('/insert', function(req, res, next) {
  var item = {
    Name: req.body.Name,
    Email: req.body.Email,
    DOB: req.body.DOB,
    hashedPassword: req.body.hashedPassword,
    jobTitle: req.body.jobTitle,
    phone :req.body.phone,
    projects: req.body.projects,
  }
  MongoClient.connect(url, function(err, client){
    assert.equal(null, err);
    const db = client.db(dbName);
    db.collection('user-data').insertOne(item, function(err, result){
      assert.equal(null, err);
      console.log('Item inserted');
      client.close();
    });
  });
  res.redirect('/');
});


/* Update data .updateOne() */
router.post('/update', function(req, res, next) {
  var idUser = String(req.body.id);
  MongoClient.connect(url, function(err, client){
    const db = client.db(dbName);
    const col = db.collection('user-data')
    col.updateOne({_id :new ObjectId(idUser)}, {$set: {
      Name: req.body.Name,
      Email: req.body.Email,
      DOB:  req.body.DOB,
      hashedPassword: req.body.hashedPassword,
      jobTitle: req.body.jobTitle,
      phone: req.body.phone,
      projects: req.body.projects}}, {upsert:true},{new: true}, function(err, doc){
          if (!err) {
            res.redirect('/get-data');
        }
        else { console.log('Error in User delete :' + err); }
      console.log(doc);
      client.close();
    });
  });
  res.redirect('/get-data');
});


/* Delete data .deleteOne() */
router.post('/delete', function(req, res, next) {
  var idRemove = String(req.body.id);
  MongoClient.connect(url, function(err, client){
      if (err) {
        console.log('Error in User delete :' + err);
    }
    const db = client.db(dbName);
    const col = db.collection('user-data');
    col.deleteOne({_id :new ObjectId(idRemove)},(err, doc) => {
      if (!err) {
        res.redirect('/get-data');
    }
    else { console.log('Error in User delete :' + err); }
    });
    client.close();
  });  
});

module.exports = router;