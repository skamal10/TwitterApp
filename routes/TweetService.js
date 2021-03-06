var mongoose = require('mongoose');
var Item = require('../model/Item.js');
var Media = require('../model/Media.js');
//var Item = mongoose.model('Item');
//var Media = mongoose.model('Media');
var Follows = mongoose.model('Follows');
var ObjectID = require("bson-objectid");

module.exports = function(){

  this.addItem = function (req, res, next) {

       // This function is gonna allow the user to add a post. For for we'll just
    // just gonna add this to a database. The front end will add it to the view.
    var id = ObjectID();
      res.json({
             "status": "OK",
             "id"   : id
            });


    var newItem = new Item();
    newItem._id = id;
    newItem.content = req.body.content;
    newItem.username = req.user.username;

    if(req.body.parent){
        newItem.parent = req.body.parent;
    }
    if(req.body.media){
      newItem.media = req.body.media;
    }

    newItem.save();
  };

  this.likeItem = function(req, res, next){
      if(req.body.like == true || req.body.like == null){
          Item.findOne({'_id': req.params.id}).maxTime(20000).exec(function(err,item){
                if (err || !item){
                          res.json({
                              "status" : "error",
                              "error" : "There was an error"
                          });
                }

                else{
                  item.likes.push(req.user._id); // add to the likes list
                  item.save(function(err){
                       res.json({
                          "status" : "OK"
                        });

                  });

                }

          });
      }

      else{
        Item.update( {'_id': req.params.id}, { $pullAll: {'likes': [req.user._id] } }, function(err , item){
          if(err || !item){
              res.json({
                              "status" : "error",
                              "error" : "There was an error"
                          });
          }
          else{
            res.json({
                  "status" : "OK"
                    });
          }
        });
      }
  }


  this.getItem = function(req, res, next){
    Item.findOne({'_id': req.params.id}).maxTime(20000).exec(function(err, item){ 
    if (err){
    res.json({
        "status" : "error",
        "error" : "There was an error"
    });
    }
    else{
    if(item){
        res.json({ "status" : "OK", 
                   "item": item });
    }
    else{ 
        res.json({
        "status" : "error",
        "error" : "Item with that id doesn't exist"
        });
    }
    }
    });
  };

 this.deleteItem = function(req, res, next){
    var tweet_id = req.params.id;
    var currentUser = req.user.username;

    Item.findOneAndRemove({ $and:[{'_id': tweet_id }, {'username': currentUser} ]}, function(err, item){
      if (err){
          res.status(500).send({ error: 'ERROR' });
      } 
      else if(!item){
        res.status(500).send({ error: 'This tweet either does not exist or you are not authorized to delete this tweet.' });
      }
      else{ 

        if(item.media){
             Media.remove({_id: {$in: item.media}}, function(){
                 res.status(200).send({ status: 'OK' });
             });
        }
        else{
           res.status(200).send({ status: 'OK' });
        }
      }

    });
  };
  
  this.searchItem = function(req, res, next){
    res.json({
      "status": "OK",
      "items"   : []
    });
  };

this.addMedia = function(req, res, next){

  var id = ObjectID();
      res.json({
             "status": "OK",
             "id"   : id
            });

    var file = req.files;
    var image = new Media();

    image.media = "";
    image._id = id;
    image.save();

};

this.getMedia = function(req, res, next){
  var id = req.params.id;
  Media.findOne({'_id': id}, function(err, img){
    if(err || !img){
           res.json({
              "status" : "error",
              "error" : "Something went wrong with the tweet"
           });
    }
    else{
        res.writeHead(200, {'Content-Type': 'image/jpeg' });
        res.end(img.media);
    }
  }); 

};

};