var mongoose = require('mongoose');


var mediaSchema = new mongoose.Schema({
    
    media: {
	  type: Buffer,
	  required: true
    }
}, { shardkey: { _id: 1 }});
mongoose.model('Media', mediaSchema);
