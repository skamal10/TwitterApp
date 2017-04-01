var mongoose = require('mongoose');


var followingSchema = new mongoose.Schema({
    
    username: {
	  type: String,
	  required: true,
	  unique: false
    },
    follows: {
	 type: String,
	 required: true,
	 unique: false
    }
});

followingSchema.index({username: 1, follows: 1}, {unique: true});
mongoose.model('Follows', followingSchema);
