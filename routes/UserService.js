var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');
var Follows = mongoose.model('Follows');
var nodemailer = require('nodemailer');
 var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'cse356twitterservice@gmail.com', // Your email id
            pass: 'cse356twitter' // Your password
        }
    });

 var MAX_FOLLOWERS_DISPLAY = 200;
 var FOLLOWERS_DISPLAY_DEFAULT = 50;



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

		// this.addUser = function(req, res, next){
		// 	// Find a user with the same username or email. 
		// 	User.findOne( { $or:[{'username': req.body.username}, {'email': req.body.email } ]}, function(err, user) { 
  //             if (err){
  //                 res.json({
  //                  "status" : "error",
  //                  "error" : "There was an error"
  //                });
  //             }

  //             if (user) { // If a user already exists, throw an error
  //                 res.json({
  //                  "status" : "error",
  //                  "error" : "User already exists"
  //                });                
  //             }

  //             else{ // else create a new user 
  //                 var user = new User();
  //                 user.username = req.body.username;
  //                 user.email    = req.body.email;
  //                 user.setPassword(req.body.password);
  //                 user.createValidateKey();

  //                 //sendEmail(user.email, user.verify_key); // send verification email

  //                 user.save(function(err){ // save in the db and send the response message
  //                 res.status(200);
  //                 res.json({
  //                             "status": "OK",
  //                             "key"   : user.verify_key
  //                        });
  //                 });
  //             } 

  //   		});
		// };
		this.addUser = function(req, res, next){
			// Find a user with the same username or email. 
                  var user = new User();
                  user.username = req.body.username;
                  user.email    = req.body.email;
                  user.setPassword(req.body.password);
                  user.createValidateKey();
                  //sendEmail(user.email, user.verify_key); // send verification email

                  user.save(function(err){ // save in the db and send the response message
                  	if(err){
                  		res.json({
			                   "status" : "error",
			                   "error" : "Username or email already exists"
			                 });
                  	}
                  else{
                  		res.json({
                              "status": "OK",
                              "key"   : user.verify_key
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

		this.searchByUserName = function(req, res, next){
			var username = req.params.username;
			 User.findOne({'username' : username},'username email -_id', function(err, user){
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
			      else{
			      	res.json({user});
			      }


			 });

		};

		this.followUser = function(req , res, next){
			var currentUser = req.user.username;
			var followUser = req.body.username;
		      var follow_user = req.body.follow == null || req.body.follow == true; 
			// prevent user from following himself
			if(currentUser === followUser){ 
				res.json({
			            "status" : "error",
			            "error" : "Can't follow yourself!"
			             });
				return;
			}

			// first check if the user the current user is trying to follow exists
			User.findOne({'username' : followUser}, function(err,user){
				if(!user){
					res.json({
			                   "status" : "error",
			                   "error" : "No such user"
			                 });
				}
				else{
				    if(follow_user){
					  var following = new Follows();
					  following.username = currentUser;
					  following.follows = followUser;
					  following.save(function(err){
						if(err){ // use indexing to make sure unique pairs
						    res.json({
						     "status" : "error",
						     "error" : "You already follow "+ followUser +"!"
						});
					    }
					    else{
						
						req.user.following.push(req.body.username);
						req.user.save();
						console.log(req.user.following);
						res.json({
							  "status": "OK"
						});
					    }
					  });
				    }
				    else{
		// This is when the user wants to unfollow a user
					  
					  Follows.findOneAndRemove({"username": req.user.username, "follows": req.body.username},function(err, user){

						if(err || !user){
						    console.error(err);
						    
						    res.json({
						     "status" : "error",
						     "error" : "You don't follow "+ followUser +"!"
						    });
						
						}
						else{
						    req.user.following.splice(
							  req.user.following.indexOf(req.body.username) ,1
						    ); 
						    req.user.save();
						    res.json({
							  "status" : "OK"
						    });
						}
						
					  });
				    }
				}

		});

	};

	this.getFollowing = function(req, res, next){
		var username = req.params.username;
		var limit = req.body.limit == null || req.body.limit > MAX_FOLLOWERS_DISPLAY || req.body.limit < 0 ? FOLLOWERS_DISPLAY_DEFAULT : req.body.limit; 
		console.log(req.params.limit);
		Follows.find({'username': username}).select('follows -_id').limit(limit).exec(function(err, users){
			if(users==null || users.length <= 0 ){
					res.json({
			            "status" : "error",
			             "error" : "This user doesn't follow anybody!"
			        });	
			}
			else{
				res.json({
						"status" : "OK",
						"usernames": users
				});
			}
		});
	};

	this.getFollowers = function(req, res, next){
		var username = req.params.username;
		var limit = req.body.limit == null || req.body.limit > MAX_FOLLOWERS_DISPLAY || req.body.limit < 0 ? FOLLOWERS_DISPLAY_DEFAULT : req.body.limit; 

		Follows.find({'follows': username}).select('username -_id').limit(limit).exec(function(err, users){
			if(users==null || users.length <= 0 ){
					res.json({
			            "status" : "error",
			             "error" : "This user doesn't follow anybody!"
			        });	
			}
			else{
				res.json({
						"status" : "OK",
						"usernames": users
				});
			}
		});
	};





};

