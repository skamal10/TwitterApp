var mongoose = require('mongoose');


var followingSchema = new mongoose.Schema({
    
    username: {
	  type: String,
	  required: true,
	  unique: false
    },
    email: {
    	type: String
    },
    follows: {
	 type: String,
	 required: true,
	 unique: false
    }
});

followingSchema.index({username: 1, follows: 1}, {unique: true});
followingSchema.index({follows : 1});
mongoose.model('Follows', followingSchema);
