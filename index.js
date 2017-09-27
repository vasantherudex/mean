var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var db;

app.use(express.static(__dirname + '/public'));

// parse application/x-www-form-urlencoded 
app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json 
app.use(bodyParser.json());
 

//Connection to database
 MongoClient.connect('mongodb://localhost:27017/Erudex', (err, database) => {
      if (err)  console.log(err); 
      console.log('connection Established with: '+database);
      db = database;        
 });

 //Getting url and response
 app.get('/', function(req, res){
     res.redirect('/views/book.html');
 });

 //getting subjects 
 app.get('/get_subjects',function(req,res){
     db.collection('book', function (err, collection) {  
         collection.find().toArray(function(err, items) {
            if(err) console.log(err);    
            //console.log(items); 
            res.send({names:items});           
        });
  /* var name = 'Vasanth';*/
   // res.send(books);
         });
 });
 
 app.post('/insert_subjects',function(req,res){
 	 console.log(req.body.id);
   if(req.body.action === 'delete'){
      var o_id = new mongo.ObjectID(req.body.id);
      db.collection('book').deleteOne({_id: o_id})
      .then(function(result) {
          console.log('Deleted successfully');
          res.send('Deleted successfully');
        })
   }
 	 else if(req.body.id){
 	 	//Updation:
     var o_id = new mongo.ObjectID(req.body.id);
     db.collection('book', function (err, collection) {
     collection.update({_id: o_id},{$set:req.body})
     .then(function(result){
      res.send('Updated successfully');
      console.log('updated successfully');
     });
 
    });
        
 
 	 }else{
 	 	//insertion
 	 	db.collection('book').insertOne(req.body).then(function(result) {
           console.log('data Inserted successfully');
           res.send('Data Inserted successfully');
        });
 	 }
 	 console.log(req.body.name);
     /*db.collection('book').insertOne(req.body).then(function(result) {
       console.log('data Inserted successfully');
       res.send('Data Inserted successfully');
     });*/
 });

app.listen(3000);

9502549254