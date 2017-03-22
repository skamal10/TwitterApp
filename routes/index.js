var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Item = mongoose.model('Item');


router.get('/login', function(req, res, next) {
	res.render('login');
});


router.get('/register',function(req, res, next){
  res.render('register');
});

// router.post('/login',passport.authenticate('local'), function(req, res) {
//     res.json({ "status" : "OK"});
//   });

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); 
    }
    if (! user) {
      return res.send({ status : "ERROR", message : 'authentication failed' });
    }
    req.login(user, function(loginErr){
      if (loginErr) {
        return next(loginErr);
      }
      return res.send({ status : "OK", message : 'authentication succeeded' });
    });      
  })(req, res, next);
});

router.post('/logout', ensureAuthenticated, function(req,res){
  req.session.destroy(function (err) {
    res.json({ status: "OK" }); 
  });
});

router.post('/addUser', function(req,res,next){

  
User.findOne( { $or:[{'username': req.body.username}, {'email': req.body.email } ]}, function(err, user) {
              if (err){
                  res.json({
                   "status" : "ERROR",
                   "errMess" : "There was an error"
                 });
              }

              if (user) {
                  res.json({
                   "status" : "ERROR",
                   "errMess" : "User already exists"
                 });                
              }

              else{
                  var user = new User();
                  user.username = req.body.username;
                  user.email    = req.body.email;
                  user.setPassword(req.body.password);
                  user.createValidateKey();

                  user.save(function(err){
                  res.status(200);
                  res.json({
                              "status": "OK",
                              "key"   : user.verify_key
                         });
                  });
              } 

    });

});



router.post('/verify', function(req,res,next){
  var email = req.body.email;
  var key = req.body.key;

  User.findOne({'email' : email}, function(err, user){
      if(err){
         res.json({
                   "status" : "ERROR",
                   "errMess" : "There was an error"
                 });
      }
      else if(!user){ // user not found
        res.json({
                   "status" : "ERROR",
                   "errMess" : "No user associated with that email"
                 });
      }
      else if(user && user.verified){ // user is already verified
          res.json({
                   "status" : "ERROR",
                   "errMess" : "User is already validated"
                 });
      }
      else if(!user.validateAccount(key)){ // invalid key
            res.json({
                   "status" : "ERROR",
                   "errMess" : "Incorrect validation key"
                 });
      }
      else{
          user.verified=true;
          user.verify_key = "";
          user.save(function(err){
            res.json({
                  "status": "OK"
            });
          });
      }
  });

});

router.post('/checkSession', function(req,res,next){
    if(req.user){
      res.send(req.user);
    }
    else{
      res.send("NOPE");
    }
});

  
router.post('/additem', ensureAuthenticated, function(req, res, next){
    
    // First we check if the tweet doesnt exceed the limit
    if(req.body.content.length > 140){    
    res.json({
    "status" : "ERROR",
            "errMess" : "Tweet must be less thna 140 characters long"
    });
    }
    else{

    // This function is gonna allow the user to add a post. For for we'll just
    // just gonna add this to a database. The front end will add it to the view.
    var newItem = new Item();
    newItem.body = req.body.content;
    newItem.user = req.user.username;
    
    newItem.save(function(err){
    if(err){
        console.error(err);
        res.json({
        "status" : "ERROR",
        "errMess" : "Something went wrong with the tweet"
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
    }
});

router.post('/search', ensureAuthenticated, function(req, res, next){
     
    var start_date;
    if(req.body.timestamp)
	  start_date = new Date(req.body.timestamp * 1000);
    else
	  start_date = new Date().now();
    
    Item.find({ 'create_date': {$lte: start_date} }).sort('-create_date').exec(function(err, itemList) {
	  console.log("We manage to find the lists, sorted and parse to array");    
	  if (err){
		console.error(err);
		res.json({
		    "status" : "ERROR",
		    "errMess" : "There was an error"
		});
	  }
	  else{
		var numItems;
		if(req.body.limit)
		    numItems = req.body.limit;
		else
		    numItems = 100;
		
		var return_items = {}
		return_items.status = 'OK';
		return_items.items = [];

		for(var i = 0; i < numItems && i < itemList.length; i++){
		    
		    var current_item = {};
		    current_item.id = itemList[i]._id;
		    current_item.username = itemList[i].user;
		    current_item.content = itemList[i].body;
		    current_item.timestamp = Math.round(itemList[i].create_date.getTime() / 1000);
		    
		    return_items.items.push(current_item);
		}

		res.send(return_items);
	  }

    });
});


router.get('/item/:id', ensureAuthenticated, function(req, res, next){
    Item.findOne({'_id': req.params.id}, function(err, item){ 
	  if (err){
		res.json({
		    "status" : "ERROR",
		    "errMess" : "There was an error"
		});
	  }
	  else{
		if(item){
		    var return_item = {};
		    return_item.id = item._id;
		    return_item.username = item.user;
		    return_item.content = item.body;
		    return_item.timestamp = Math.round(item.create_date.getTime() / 1000);

		    res.json({"status" : "OK", 
                   "item": return_item});
		}
		else{ 
		    res.json({
			  "status" : "ERROR",
			  "errMess" : "Item with that id doesn't exist"
		    });
		}
	  }
    });
});

var isLoggedIn = function(req, res, next){
   res.send(req.isAuthenticated() ? req.user : '0');
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user){
	  return next();
    }else{
        res.json({
            "status" : "ERROR",
            "errMess" : "Must be logged in to access this concent"
        });
    }
}

module.exports = router;
