var mongoose = require('mongoose');
var Item = require('../model/Item.js');
var Media = mongoose.model('Media');
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
    // newItem.save(function(err, item){
	   //  if(err || !item){
	   //      res.json({
	   //      "status" : "error",
	   //      "error" : err
	   //      });
	   //  }
	   //  else{
	   //      res.json({
	   //      "status": "OK",
	   //      "id"   : newItem._id
	   //      });
	   //  }
    // });
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

    res.status(200).send({ status: 'OK' });

    Item.findOneAndRemove({ $and:[{'_id': tweet_id }, {'username': currentUser} ]}, function(err, item){
        if(item.media){
             Media.remove({_id: {$in: item.media}});
        }
    });
  };
  this.searchItem = function(req, res, next){
  	var start_date;
    if(req.body.timestamp){
       
          start_date = new Date(req.body.timestamp * 1000);
    }
    else{
          start_date = new Date();
    }

    var numItems;

    if(req.body.limit && req.body.limit<= 100){
              numItems = req.body.limit;
    }
    else{
        numItems = 25;
    }

    if(req.body.q){
     res.json({
      "status": "OK",
      "items"   : []
    });
    }
    else{
    var findByFollowing = req.body.following == null || req.body.following == true ? true : false;

    if(findByFollowing){
      var username = req.user.username;
          Follows.find({'username': username}).distinct('follows').exec(function(err, following){
            Item.find({ $and: 
            [req.body.username ? {'username': req.body.username} : {}, 
            { 'times': {$lte: start_date} },
   //         req.body.q ? {$text: {$search: req.body.q}} : {},
            { username: { $in: following } } ]}
            ).limit(numItems).sort({times: -1}).maxTime(20000).exec(function(err, itemList) {     
            if (err){
                  res.json({
                      "status" : "error",
                      "error" : err.message
                  });
            }
            else{
                var return_items = {}
                return_items.status = 'OK';
                return_items.items = itemList;
                res.send(return_items);
            }

            });

      });
    }
  else{
        Item.find({ $and: 
            [req.body.username ? {'username': req.body.username} : {}, 
             req.body.parent ? {'parent' : req.body.parent} : {},
            { 'times': {$lte: start_date} }]}
            ).limit(numItems).sort({times: -1}).maxTime(20000).exec(function(err, itemList) {     
            if (err){
                  res.json({
                      "status" : "error",
                      "error" : err.message
                  });
            }
            else{
                var return_items = {}
                return_items.status = 'OK';
                return_items.items = itemList;
                res.send(return_items);
            }

            });
  }
}

  };

this.addMedia = function(req, res, next){

  var id = ObjectID();
      res.json({
             "status": "OK",
             "id"   : id
            });

    var file = req.files;
    var image = new Media();

    image.media = file[0].buffer;
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

