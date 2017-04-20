var mongoose = require('mongoose');
var Item = mongoose.model('Item');
var Follows = mongoose.model('Follows');

module.exports = function(){

  this.addItem = function (req, res, next) {

       // This function is gonna allow the user to add a post. For for we'll just
    // just gonna add this to a database. The front end will add it to the view.
    var newItem = new Item();
    newItem.content = req.body.content;
    newItem.username = req.user.username;
    newItem.parent = req.body.parent;
    newItem.media = req.body.media;
    
    newItem.save(function(err){
	    if(err){
	        console.error(err);
	        res.json({
	        "status" : "error",
	        "error" : "Something went wrong with the tweet"
	        });
	    }
	    else{
	        res.status(200);
	        res.json({
	        "status": "OK",
	        "id"   : newItem._id
	        });
	    }
    });
  };

  this.likeItem = function(req, res, next){
      if(req.body.like == true || req.body.like == null){
          Item.findOne({'_id': req.params.id}, function(err,item){
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
        console.log(req.user._id);
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
  	Item.findOne({'_id': req.params.id}, function(err, item){ 
	  if (err){
		res.json({
		    "status" : "error",
		    "error" : "There was an error"
		});
	  }
	  else{
		if(item){
        	item.id = item._id;
		    res.json({"status" : "OK", 
                   "item": item});
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
    	   res.status(200).send({ error: 'OK' });

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


    var findByFollowing = req.body.following == null || req.body.following == true ? true : false;

    if(findByFollowing){
      var username = req.user.username;
          Follows.find({'username': username}).distinct('follows').exec(function(err, following){
            Item.find({ $and: 
            [req.body.username ? {'username': req.body.username} : {}, 
            { 'timestamp': {$lte: start_date} },
            req.body.q ? {$text: {$search: req.body.q}} : {},
            { username: { $in: following } } ]}
            ).limit(numItems).exec(function(err, itemList) {     
            if (err){
                  res.json({
                      "status" : "error",
                      "error" : "There was an error"
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
            { 'timestamp': {$lte: start_date} },
            req.body.q ? {$text: {$search: req.body.q}} : {}]}
            ).limit(numItems).sort({timestamp: 1}).exec(function(err, itemList) {     
            if (err){
                  res.json({
                      "status" : "error",
                      "error" : "There was an error"
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

  };


  this.addMedia = function(req, res, next){
        var file = req.files;
        var image = new Media();
        image.media = file[0].buffer;
        image.save(function(err, image){
          if(err){
              console.error(err);
              res.json({
              "status" : "error",
              "error" : "Something went wrong with the tweet"
              });
          }
          else{
              res.json({
              "status": "OK",
              "id"   : image._id
              });
          }
    });

};

};