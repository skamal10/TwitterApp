var mongoose = require('mongoose');
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);

var itemSchema = new mongoose.Schema({
    
    user: {
	  type: String,
	  required: true,
	  unique: true
    },
    body: {
	 type: String,
	 required: true
    },
    create_date: { 
	 type: Date, 
	 default: Date.now 
    }
});

itemSchema.plugin(autoIncrement.plugin, 'Item');
mongoose.model('Item', itemSchema);
