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
var mysql = require('mysql');
var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'hw7'

})
var Memcached = require('memcached');
var memcached = new Memcached('localhost:11211');





module.exports = function(){

		this.mysqlStuff = function(req, res, next){
			var state = req.body.state;
			var service_state = req.body.service_type;

			var key = state+service_state;
			var queryStr = 'SELECT AVG(comm_rate) AS comm_rate_avg, AVG(ind_rate) AS ind_rate_avg, AVG(res_rate) AS res_rate_avg FROM electric WHERE state = \''+ state+ '\' AND service_type = \''+service_state+'\'';
			memcached.get(key, function (err, data) {
  					if(!data){
  					connection.connect(function(err) {
			  		connection.query(queryStr, function(err, result) {
			  		var ret = {};
			  		ret.status = 'OK';
			  		ret.comm_rate_avg = result[0].comm_rate_avg;
			  		ret.ind_rate_avg = result[0].ind_rate_avg;
			  		ret.res_rate_avg = result[0].res_rate_avg;
			  		memcached.add(key, ret , 1);
			  		res.json(ret);
			  });
			});
  					}
  					else{
  						res.json(data);
  					}
				});
		}

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
			User.findOne({'username' : username}, 'email -_id',function(err, user){
				if(err || !user ){
			         res.json({
			                   "status" : "error",
			                   "error" : "There was an error"
			                 });
			      }
			    else{
			    	Follows.count({'username' : username},function(err, followsCount){

			    		Follows.count({'follows': username},function(err, followersCount){
			    				var currentUser = {};
			    				currentUser.email = user.email;
			    				currentUser.following =  followsCount;
			    				currentUser.followers = followersCount;
			    				res.json({
			    					"status": "OK",
			    					"user"  : currentUser
			    				});
			    		});
			    	});
			     }
			});
		};

		this.followUser = function(req , res, next){
			var currentUser = req.user.username;
			var followUser = req.body.username;
		      var isFollow = req.body.follow == null || req.body.follow == true; 
			// prevent user from following himself
			if(currentUser === followUser){ 
				res.json({
			            "status" : "error",
			            "error" : "Can't follow yourself!"
			             });
				return;
			}
			else if(!isFollow){ // if this boolean value is false, go to unfollow function
				return next();
			}

			else{
				User.findOne({'username' : followUser}, function(err,user){
					if(!user || err){
						res.json({
				                   "status" : "error",
				                   "error" : "No such user"
				                 });
					}
					else{
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
								res.json({
									  "status": "OK"
								});
						    }
						 });
					}
				});
			}
		};

		this.unfollowUser = function(req, res, next){
			var currentUser = req.user.username;
			var unfollowUser = req.body.username;

			Follows.findOneAndRemove({"username": currentUser, "follows": unfollowUser},function(err, user){
					if(err || !user){
						    res.json({
						     "status" : "error",
						     "error" : "You don't follow "+ unfollowUser +"!"
						    });
						
						}
						else{ // SUCCESSFULLY REMOVED!
						    res.json({
							  "status" : "OK"
						    });
						}
						
					  });
		}

	this.getFollowing = function(req, res, next){
		var username = req.params.username;
		var limit = req.body.limit == null || req.body.limit > MAX_FOLLOWERS_DISPLAY || req.body.limit < 0 ? FOLLOWERS_DISPLAY_DEFAULT : req.body.limit; 
		console.log(req.params.limit);
		Follows.find({'username': username}).select('follows -_id').limit(limit).exec(function(err, users){
			if(users==null){
					res.json({
			            "status" : "error",
			             "error" : "This user doesn't follow anybody!"
			        });	
			}
			else{
				res.json({
						"status" : "OK",
						"users": users
				});
			}
		});
	};

	this.getFollowers = function(req, res, next){
		var username = req.params.username;
		var limit = req.body.limit == null || req.body.limit > MAX_FOLLOWERS_DISPLAY || req.body.limit < 0 ? FOLLOWERS_DISPLAY_DEFAULT : req.body.limit; 

		Follows.find({'follows': username}).select('username -_id').limit(limit).exec(function(err, users){
			if(users==null){
					res.json({
			            "status" : "error",
			             "error" : "This user doesn't follow anybody!"
			        });	
			}
			else{
				res.json({
						"status" : "OK",
						"users": users
				});
			}
		});
	};





};

