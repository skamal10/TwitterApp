var mongoose = require('mongoose');


var followSchema = new mongoose.Schema({
    
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
}, { shardkey: { username: 1 }});

followSchema.index({username: 1, follows: 1}, {unique: true});
mongoose.model('Follows', followSchema);
