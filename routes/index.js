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
      return res.send({ status : "error", message : 'authentication failed' });
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
                   "status" : "error",
                   "error" : "There was an error"
                 });
              }

              if (user) {
                  res.json({
                   "status" : "error",
                   "error" : "User already exists"
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
                   "status" : "error",
                   "error" : "There was an error"
                 });
      }
      else if(!user){ // user not found
        res.json({
                   "status" : "error",
                   "error" : "No user associated with that email"
                 });
      }
      else if(user && user.verified){ // user is already verified
          res.json({
                   "status" : "error",
                   "error" : "User is already validated"
                 });
      }
      else if(!user.validateAccount(key)){ // invalid key
            res.json({
                   "status" : "error",
                   "error" : "Incorrect validation key"
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
});

router.post('/search', ensureAuthenticated, function(req, res, next){
     
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
		return_items.items = itemList;

    for(var i=0;i<return_items.items.length; i++){
      return_items.items[i].id = return_items.items[i]._id;
    }
		res.send(return_items);
	  }

    });
});


router.get('/item/:id', ensureAuthenticated, function(req, res, next){
    Item.findOne({'_id': req.params.id}, function(err, item){ 
	  if (err){
		res.json({
		    "status" : "error",
		    "error" : "There was an error"
		});
	  }
	  else{
		if(item){
		    // var return_item = {};
		    // return_item.id = item._id;
		    // return_item.username = item.username;
		    // return_item.content = item.content;
		    // return_item.timestamp = Math.round(item.timestamp.getTime() / 1000);

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
});

var isLoggedIn = function(req, res, next){
   res.send(req.isAuthenticated() ? req.user : '0');
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated() && req.user){
	  return next();
    }else{
        res.json({
            "status" : "error",
            "error" : "Must be logged in to access this concent"
        });
    }
}

module.exports = router;
