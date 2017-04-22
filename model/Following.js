var mongoose = require('mongoose');


var followingSchema = new mongoose.Schema({
    
    username: {
	  type: String
    },
    followedBy: {
	 type: String
    }
});

followingSchema.index({username: 1, followedBy: 1}, {unique: true});
mongoose.model('Following', followingSchema);
