
// mongod --dbpath=/Users/saikathika/data/db
var express = require('express');
var ObjectId = require('mongodb').ObjectID;
var router = express.Router();
var assert = require('assert');
// var url = "mongodb://localhost:27017";
// const MongoClient = require('mongodb').MongoClient;
// const client = new MongoClient(url);
const dbName = 'test';

const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://HK_superworld:BugfexRacfJjG7y@superworldvna.gxlyf.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(url, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("user-data");
  client.close();
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/user-profile', function(req, res, next) {
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

// router.post('/update', function(req, res, next) {
//   var id = req.body.id;

//   MongoClient.connect(url, function(err, client){
//     assert.equal(null, err);
//     const db = client.db(dbName);
//     db.collection('user-data').findById(id, function(err, doc){
//       assert.equal(null, err);
//       doc.Name = req.body.Name;
//       doc.Email = req.body.Email;
//       doc.DOB = req.body.DOB;
//       doc.HashedPassword = req.body.HashedPassword;
//       doc.jobTitle = req.body.jobTitle;
//       doc.phone = req.body.phone;
//       doc.projects = req.body.projects;
//       doc.save();
//       console.log('Item updated');
//       client.close();
//     });
//   });
//   res.redirect('/get-data');
// });
router.post('/update', function(req, res, next) {
  const filter = {"_id": req.body.id};
  const update = {
      Name: req.body.Name,
      Email: req.body.Email,
      DOB:  req.body.DOB,
      hashedPassword: req.body.hashedPassword,
      jobTitle: req.body.jobTitle,
      phone: req.body.phone,
      projects: req.body.projects,
  };
  MongoClient.connect(url, function(err, client){
    const db = client.db(dbName);
    db.collection('user-data').findOneAndUpdate(filter, update, {upsert:true},{new: true}, function(err, doc){
      assert.equal(null, err);
      if(err) return console.log(err);
      console.log('Item updated');
      console.log(doc);
      client.close();
    });
  });
  res.redirect('/get-data');
});

router.post('/delete', function(req, res, next) {
  var idRemove = String(req.body.id);
  console.log("In delete method removing ");
  console.log(idRemove);
  MongoClient.connect(url, function(err, client){
      if (err) {
        console.log('Error in User delete :' + err);
    }
    const db = client.db(dbName);
    const col = db.collection('user-data');
    console.log("In delete method");
    // db.collection('user-data').findByIdAndRemove(id).exec();
    col.deleteOne({_id :new ObjectId(idRemove)},(err, doc) => {
      if (!err) {
        res.redirect('/get-data');
    }
    else { console.log('Error in User delete :' + err); }
    });
    console.log(" delete method");
    client.close();
  });  
});

module.exports = router;

// var express = require('express');
// var router = express.Router();
// var mongoose = require('mongoose');
// mongoose.connect('localhost:27017/test');
// mongodb+srv://saiprem98:saiprem98@test.i0zte.mongodb.net/<dbname>?retryWrites=true&w=majority

// var Schema = mongoose.Schema;

// var userDataSchema = new Schema({
//   title: {type: String, required: true},
//   content: String,
//   author: String
// }, {collection: 'user-data'});

// var UserData = mongoose.model('UserData', userDataSchema);

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

// router.get('/get-data', function(req, res, next) {
//   UserData.find()
//       .then(function(doc) {
//         res.render('index', {items: doc});
//       });
// });

// router.post('/insert', function(req, res, next) {
//   var item = {
//     title: req.body.title,
//     content: req.body.content,
//     author: req.body.author
//   };

//   var data = new UserData(item);
//   data.save();

//   res.redirect('/');
// });

// router.post('/update', function(req, res, next) {
//   var id = req.body.id;

//   UserData.findById(id, function(err, doc) {
//     if (err) {
//       console.error('error, no entry found');
//     }
//     doc.title = req.body.title;
//     doc.content = req.body.content;
//     doc.author = req.body.author;
//     doc.save();
//   })
//   res.redirect('/');
// });

// router.post('/delete', function(req, res, next) {
//   var id = req.body.id;
//   UserData.findByIdAndRemove(id).exec();
//   res.redirect('/get-data');
// });

// module.exports = router;