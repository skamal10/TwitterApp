var mongoose = require('mongoose');
var itemSchema = new mongoose.Schema({
    
    username: {
	  type: String
    },
    content: {
	 type: String
    },
    times: { 
	 type: Date, 
	 default: Date.now 
    },
    parent:{
    	type: Number
    },
    media: [mongoose.Schema.Types.ObjectId],
    likes: [mongoose.Schema.Types.ObjectId]
});
itemSchema.virtual('id').get(function() { return this._id; });
itemSchema.virtual('timestamp').get(function(){return new Date(this.times)*1000;});
itemSchema.set('toJSON', {
    virtuals: true
});
itemSchema.index( {content: "text"} );
mongoose.model('Item', itemSchema);
