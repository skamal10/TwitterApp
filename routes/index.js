
var express = require('express');
var router = express.Router();


// render get requests
router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/verify', function(req,res, next) {
  res.render('verify');
});

router.get('/adduser',function(req, res, next){
  res.render('register');
});

router.get('/additem',function(req, res, next){
  res.render('add_tweet');
});

router.get('/search',function(req, res, next){
  res.render('search');
});

router.get('/search',function(req, res, next){
  res.render('search');
});

router.get('/lb',function(req,res,next){
  res.send('i fucked my dad');
})
// --------------ITEM LOGIC --> tweetHelper.js
router.post('/additem', ensureAuthenticated, addItem);
router.post('/search', ensureAuthenticated, searchItem);
router.get('/item/:id', ensureAuthenticated, getItem);
router.delete('/item/:id', ensureAuthenticated, deleteItem);

// ---------------USER LOGIC --> UserService.js

router.post('/login', login);
router.post('/logout', ensureAuthenticated, logout);
router.post('/addUser', addUser);
router.post('/verify', verifyUser);
router.get('/user/:username', searchByUserName);
router.post('/follow', followUser,unfollowUser);
router.get('/user/:username/following', getFollowing);
router.get('/user/:username/followers', getFollowers);




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
