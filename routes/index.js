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

passport.authenticate('local', function(err, user, info){
    
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


var isLoggedIn = function(req, res, next){
   res.send(req.isAuthenticated() ? req.user : '0');
}



module.exports = router;
