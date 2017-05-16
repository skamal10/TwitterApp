var mongoose = require('mongoose');

var conn = mongoose.createConnection('mongodb://127.0.0.1:27017/twitter_db', { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } });

var mediaSchema = new mongoose.Schema({
    
    media: {
	  type: Buffer
    }
});
//mongoose.model('Media', mediaSchema);
module.exports = conn.model('Media', mediaSchema);
