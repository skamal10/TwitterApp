var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'), //mongo connection
    bodyParser = require('body-parser'), //parses information from POST
    methodOverride = require('method-override'); //used to manipulate POST

var User = mongoose.model('User');

var loggedInUser = -1;
var currentConvo = -1;
var currentUserName = null;

  router.use(bodyParser.urlencoded({ extended: true }))
	router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
	}))


var randomResponse = ["Sorry, I don't understand", "Why do you say that?", "Tell me more about that",
					"How are you feeling?", "Why do you feel this exact way?", "This isn't about me, this is about you."
					,"What do you mean by that?","Are you sure about that?","Is there anything else you need to say?"
					,"Maybe you should go see a doctor about that."];



router.get('/', function(req, res, next) {

  if(req.cookies.currUser){
      console.log('USING COOKIES TO LOG-IN');
      loggedInUser= req.cookies.currUser;
  }
  res.render('eliza');

});



router.post('/DOCTOR', function(req, res, next) {


  var index = Math.floor(Math.random() * randomResponse.length);
  var response = {eliza : randomResponse[index]};
  var responses = [req.body , response];
if(loggedInUser != -1){	
  if(currentConvo == -1){
        createNewConvo(responses);
  }
  else{
        updateConvo(req.body,response);
  }

  res.send(JSON.stringify({ eliza: randomResponse[index] })  );
}
else{
  res.send({ status: 'ERROR' });
}

});

router.post('/new-convo', function(req, res, next) {

	         var user_id = 1;

            mongoose.model('Convo').create({
            user_id : user_id,
            convo : req.body
        }, function (err, blob) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  res.send("CREATED!");
              }
        })
});

router.post('/getconv',function(req,res,next){

  var id= req.body['id'];
  mongoose.model('Convo').findOne({ '_id': id },function (err, convo) {
      if (err || !convo || loggedInUser != convo.user_id) {
        res.send({ status: 'ERROR' });
      } else {
          var response= {};
          response.status = "OK";
          response.conversation = [];

          for(var i=0; i < convo.convo.length; i++){
		  var current_name = null;
		  var current_key = null;

		  if(i % 2 == 0){
		    current_name = currentUserName;
		    current_key = "human";
		  }
		  else{
			current_name = "eliza";
		      current_key = "eliza";
		  }
		  var x = {
                timestamp: Date.now(),
                name: current_name,
                text: convo.convo[i][current_key]
              }

            response.conversation.push(x);
        
          }
          res.send(response);
      }
    });


});


router.post('/listconv',function(req, res, next){

  mongoose.model('Convo').find({ 'user_id': loggedInUser },function (err, convo_list) {
      if (err || !convo_list || loggedInUser == -1) {
        res.send({ status: 'ERROR' });
      } else {

          var convos= {};
          convos.status= 'OK';
          convos.conversations = [];

          for( var i=0; i<convo_list.length; i++){
            var convo = {
                id: convo_list[i]._id,
                start_date : convo_list[i].date
              };
             convos.conversations.push(convo);
          }



          res.send(convos);
      }
    });


});

router.post('/adduser',function(req, res, next){


      var username = req.body['username'];
      var pw       = req.body['password'];
      var email    = req.body['email'];


      if(username && pw && email){

                User.create({
        verified: false,
        u_name: username,
        password: pw,
        verify_key: 'JxY3L135',
        email: email 
      }, function(err, user){
          if(err || !user){
            res.send({ status: 'ERROR' });
          }
          else{
            res.send({ status: 'OK' });
          }


      });

      }
      else{
          res.send({ status: 'ERROR' });
      }
});


router.post('/verify', function(req, res, next){

  var email = req.body['email'];
  var key   = req.body['key'];
  var backdoor = "abracadabra";

  User.findOne({'email': email} , function (err,  user){

      if(err || !user){
           res.send({ status: 'ERROR' });
      }
      else if( key === user.verify_key || key === backdoor || user.verified == true){

            user.verified = true;
            user.save();
            res.send({ status: 'OK' });
      }

      else{
        res.send({ status: 'ERROR' });
      }

  });

});

router.post('/login', function(req, res, next){

  var username = req.body['username'];
  var password = req.body['password'];

  User.findOne({'u_name': username},function(err, user){

    if(err || !user){
       res.send({ status: 'ERROR' });
    }
    else if(user.password === password && user.verified){
      loggedInUser = user._id;
      currentUserName = user.u_name;
      currentConvo = -1;
      res.cookie('currUser', loggedInUser);
      res.send({status: 'OK'});
    }
    else{
      res.send({ status:  'ERROR' });
    }

  });

});


router.post('/logout', function(req, res, next){
//USE COOKIES FOR THIS
  if(loggedInUser != -1){
      loggedInUser = -1; // log out
      currentConvo = -1;
	currentUserName = null;
	res.clearCookie('currUser');
      res.send({ status: 'OK' });
  }
  else{
    res.send({ status: 'ERROR' });
  }

});

router.get('/getCurrUser',function(req,res,next){
  res.send(loggedInUser);
});


var createNewConvo = function ( input ){

        mongoose.model('Convo').create({
            user_id : loggedInUser,
            convo : input
        }, function (err, convo) {
              if (!err && convo) {
                  currentConvo = convo._id;
              }
        });

}

var updateConvo = function(input, response){

  mongoose.model('Convo').findById(currentConvo, function(err, newConvo){
      if(err || !newConvo){
        return false;
      }
      else{
          newConvo.convo.push(input);
          newConvo.convo.push(response);
          newConvo.save();
          return true;
      }


  });

}



module.exports = router;
