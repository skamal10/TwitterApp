var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');



router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/register',function(req, res, next){
  res.render('register');
});



router.post('/login', function(req,res,next){

passport.authenticate('local', {session: true}, function(err, user, info){
    
              if (err) {
                  res.json({
                   "status" : "ERROR",
                   "errMess" : err
                 });
              }

              // If a user is found
              if( user ){
                res.json({
                  "status" : "OK"
                });
              } else {
                res.json({
                   "status" : "ERROR",
                   "errMess" : info
                 });
              }
  })(req, res);
});

router.post('/addUser', function(req,res,next){

  User.findOne({ 'username':  req.body.username }, function(err, user) {

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

    // This function is gonna allow the user to add a post. For for we'll just
    // just gonna add this to a database. The front end will add it to the view.


});


var isLoggedIn = function(req, res, next){
   res.send(req.isAuthenticated() ? req.user : '0');
}

function ensureAuthenticated(req, res, next){
    if(req.isAuthenticated()){
	  return next();
    }else{
        res.json({
            "status" : "ERROR",
            "errMess" : "Must be logged in to access this concent"
        });
    }
}

module.exports = router;
