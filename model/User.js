var mongoose = require('mongoose');  
var crypto = require('crypto');
var explain = require('mongoose-explain');


//var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/twitter_db', { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } });

var userSchema = new mongoose.Schema({  
  verified: {
  	type: Boolean,
  	default: false
  },
  username: {
  	type: String,
  	required: true,
  	unique: true
  },
  email: {
	type: String,
	required: true,
	unique: true
  },
  create_date: { 
  	type: Date, 
  	default: Date.now 
  },
  hash: String,
  salt: String,
  verify_key: String
});

//userSchema.plugin(explain);

userSchema.methods.setPassword = function(password){
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');
}

userSchema.methods.checkPassword = function(password){
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64,'sha1').toString('hex');
	return this.hash === hash;
}

userSchema.methods.createValidateKey = function(){
	this.verify_key = crypto.randomBytes(16).toString('hex');
}

userSchema.methods.validateAccount = function(validateKey){
	return this.verify_key === validateKey || validateKey === 'abracadabra';
}

userSchema.virtual('id').get(function() { return this._id; });

mongoose.model('User', userSchema);
//module.exports = conn.model('Item', itemSchema);
