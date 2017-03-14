var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.serializeUser(function(user, done) {
        done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
    	if (err) { return done(err); }
    	if (!user) { 
    		return done(null, false,{ 	// username is not in db
      			message: 'User not found'
      			}); 
  	 		}
    	if (!user.checkPassword(password)) {  // invalid password
    		return done(null, false,{
      			message: 'Invalid password'
      			}); 
  	 		}
  	 	if(!user.verified){ // not verified
  	 		return done(null, false, {
  	 			message: 'User not verified'
  	 		});
  	 	}
      return done(null, user);
    });
  }
));


passport.use('local-signup', new LocalStrategy(
  function(req, username, password, done) {
     process.nextTick(function() {

        User.findOne({ username :  username }, function(err, user) {
          
            if (err){
                return done(err);
            }

            if (user) {
                return done(null, false, req.flash('signupMessage', 'There is a user with that username already!'));
            } else {

               
                var newUser = new User();
                newUser.username   = username;
                newUser.setPassword(password);
         		newUser.createValidateKey();

                // save the user
                newUser.save(function(err) {
                    if (err){
                        throw err;
                    }
                    return done(null, newUser);
                });
            }

        });    

        });

    }));





