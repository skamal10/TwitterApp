var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var itemSchema = new mongoose.Schema({
    
    username: {
	  type: String,
	  required: true,
	  unique: false
    },
    content: {
	 type: String,
	 required: true
    },
    times: { 
	 type: Date, 
	 default: Date.now 
    },
    parent:{
    	type:  Number
    },
    media: [mongoose.Schema.Types.ObjectId],
    likes: [mongoose.Schema.Types.ObjectId]
});
itemSchema.virtual('id').get(function() { return this._id; });
itemSchema.virtual('timestamp').get(function{return new Date(this._id);});
itemSchema.set('toJSON', {
    virtuals: true
});
itemSchema.index( {content: "text"} );
itemSchema.index( {timestamp: -1});
itemSchema.plugin(autoIncrement.plugin, 'Item');
mongoose.model('Item', itemSchema);
