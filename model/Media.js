var mongoose = require('mongoose');


var mediaSchema = new mongoose.Schema({
    
    media: {
	  type: Buffer,
	  required: true
    }
});
mongoose.model('Media', mediaSchema);
