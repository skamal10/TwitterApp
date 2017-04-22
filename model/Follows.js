var mongoose = require('mongoose');


var followSchema = new mongoose.Schema({
    
    username: {
	  type: String
    },
    follows: {
	 type: String
    }
});

followSchema.index({username: 1, follows: 1}, {unique: true});
mongoose.model('Follows', followSchema);
