var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var nodemailer = require('nodemailer');
 var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cse356twitterservice@gmail.com', // Your email id
            pass: 'cse356twitter' // Your password
        }
    });


module.exports = function(){

		this.login = function (req, res, next) {
			  passport.authenticate('local', function(err, user, info) {
				    if (err) { 
				      return next(err); 
				    }
				    if (! user) {
				      return res.send({ status : "error", message : 'authentication failed' }); // if no user exists, send error
				    }
				    req.login(user, function(loginErr){
				      if (loginErr) { 
				        return next(loginErr);
				      }
				      return res.send({ status : "OK", message : 'authentication succeeded' });
				    });      
				  })(req, res, next);
		};

		this.logout = function(req, res, next){
			req.session.destroy(function (err) { // make sure to destroy the session to logout
    			res.json({ status: "OK" }); 
  			});
		};

		this.addUser = function(req, res, next){
			// Find a user with the same username or email. 
			User.findOne( { $or:[{'username': req.body.username}, {'email': req.body.email } ]}, function(err, user) { 
              if (err){
                  res.json({
                   "status" : "error",
                   "error" : "There was an error"
                 });
              }

              if (user) { // If a user already exists, throw an error
                  res.json({
                   "status" : "error",
                   "error" : "User already exists"
                 });                
              }

              else{ // else create a new user 
                  var user = new User();
                  user.username = req.body.username;
                  user.email    = req.body.email;
                  user.setPassword(req.body.password);
                  user.createValidateKey();

                  sendEmail(user.email, user.verify_key); // send verification email

                  user.save(function(err){ // save in the db and send the response message
                  res.status(200);
                  res.json({
                              "status": "OK",
                              "key"   : user.verify_key
                         });
                  });
              } 

    		});
		};


		this.verifyUser = function(req, res, next){
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
		};

		
		this.sendEmail = function( email, verify_key){
      
			  var text = 'Thank you for registering for Twitter. \n \n Your verification key is as follows: ' + verify_key;
			  var mailOptions = {
			    from: 'nyklyfe@gmail.com', // sender address
			    to: email, // list of receivers
			    subject: 'Twitter Verification', // Subject line
			    text: text 
				};

				transporter.sendMail(mailOptions, function(error, info){
				    if(error){
				        console.log(error);
				    }
				});

		};	

};

