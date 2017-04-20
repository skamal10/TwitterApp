var mongoose = require('mongoose');


var followingSchema = new mongoose.Schema({
    
    username: {
	  type: String,
	  required: true,
	  unique: false
    },
    followedBy: {
	 type: String,
	 required: true,
	 unique: false
    }
});

followingSchema.index({username: 1, followedBy: 1}, {unique: true});
mongoose.model('Following', followingSchema);
