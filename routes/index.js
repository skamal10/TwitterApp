
var express = require('express');
var router = express.Router();
var multer = require('multer');
var upload =  multer({ storage: multer.memoryStorage({}) });


// render get requests
router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/',function(req,res,next){
  res.render('index');
});

router.get('/addtweet',function(req,res,next){
  res.render('add_tweet');
});

router.get('/nav', function(req,res,next){
  res.render('nav');
})

router.get('/tweet',function(req,res,next){
  res.render('tweet');
});

router.get('/followers', function(req,res,next){
  res.render('followers');
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
  res.send('TESTING!!!!!');
})
// --------------ITEM LOGIC --> tweetHelper.js
router.post('/additem', ensureAuthenticated, addItem);
router.post('/search', ensureAuthenticated, searchItem);
router.get('/item/:id', ensureAuthenticated, getItem);
router.delete('/item/:id', ensureAuthenticated, deleteItem);
router.post('/item/:id/like', ensureAuthenticated, likeItem);
router.post('/addmedia', ensureAuthenticated, upload.any(), addMedia);

// ---------------USER LOGIC --> UserService.js

router.post('/login', login);
router.post('/logout', logout);
router.post('/addUser', addUser);
router.post('/verify', verifyUser);
router.get('/user/:username', searchByUserName);
router.post('/follow', followUser,unfollowUser);
router.get('/user/:username/following', getFollowing);
router.get('/user/:username/followers', getFollowers);
router.get('/media/:id',getMedia);




var isLoggedIn = function(req, res, next){
   res.send(req.isAuthenticated() ? req.user : '0');
}

router.get('/loggedInUser', isLoggedIn);

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
