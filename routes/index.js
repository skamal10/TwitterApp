var express = require('express');
var router = express.Router();



router.get('/login', function(req, res, next) {
	res.render('login');
});

router.post('/login', passport.authenticate('local', {
        successRedirect : '/', 
        failureRedirect : '/login', 
        failureFlash : true 
}));

router.post('/addUser', function(req, res, next){

    passport.authenticate('local-signup', function (err, user, info) {
            if(err) { return next(err); }
            if(!user) { return res.json({ "status" : 'error'})}
        });
    
});






module.exports = router;
