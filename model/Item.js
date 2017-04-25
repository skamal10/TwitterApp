var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/twitter_db', { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } });

var explain = require('mongoose-explain');

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
    	type: mongoose.Schema.Types.ObjectId
    },
    media: [mongoose.Schema.Types.ObjectId],
    likes: [mongoose.Schema.Types.ObjectId]
});

//itemSchema.plugin(explain);

itemSchema.virtual('id').get(function() { return this._id; });
itemSchema.virtual('timestamp').get(function(){return new Date(this.times)*1000;});
itemSchema.set('toJSON', {
    virtuals: true
});
//itemSchema.index( {times: -1});
//itemSchema.index( {content: "text"} );
conn.model('Item', itemSchema);
