var mongoose = require('mongoose');
var Item = mongoose.model('Item');

module.exports = function(){

  this.addItem = function (req, res, next) {

       // This function is gonna allow the user to add a post. For for we'll just
    // just gonna add this to a database. The front end will add it to the view.
    var newItem = new Item();
    newItem.content = req.body.content;
    newItem.username = req.user.username;
    
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
    	    res.json({
    	     "status" : "error",
    	     "error" : "There was an error"
    	   });
    	} 
    	else if(!item){
    	    res.json({
    	     "status" : "error",
    	     "error" : "This tweet either does not exist or you are not authorized to delete this tweet."
    	   });
    	}
    	else{
    	   res.json({
    	     "status" : "OK"
    	   });
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
    //Item.find({ 'timestamp': {$lte: start_date} }).sort('-timestamp').limit(numItems).exec(function(err, itemList) { 
    Item.find({ 'timestamp': {$lte: start_date} }).limit(numItems).exec(function(err, itemList) {     
	  if (err){
		console.error(err);
		res.json({
		    "status" : "error",
		    "error" : "There was an error"
		});
	  }
	  else{
		var return_items = {}
		return_items.status = 'OK';
		return_items.items = [];

    for(var i=0; i<itemList.length; i++){
      
        var tempItem = {};
        tempItem.id = itemList[i]._id;
        tempItem.content = itemList[i].content;
        tempItem.username = itemList[i].username;
        tempItem.timestamp = Math.round(itemList[i].timestamp.getTime() / 1000);

        return_items.items.push(tempItem);
    }
		res.send(return_items);
	  }

    });
  };



};