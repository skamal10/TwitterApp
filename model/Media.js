var mongoose = require('mongoose');


var mediaSchema = new mongoose.Schema({
    
    media: {
	  type: Buffer,
	  required: true,
	  unique: false
    }
});
mongoose.model('Media', mediaSchema);
