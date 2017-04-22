var mongoose = require('mongoose');


var mediaSchema = new mongoose.Schema({
    
    media: {
	  type: Buffer
    }
});
mongoose.model('Media', mediaSchema);
