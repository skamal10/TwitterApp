var mongoose = require('mongoose');
//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://130.245.168.122/twitter_db');
//mongoose.connect('mongodb://192.168.1.32/twitter_db');
mongoose.connect('mongodb://192.168.1.55:27018/twitter_db', { server: { socketOptions: { keepAlive: 300000, connectTimeoutMS: 30000 } } });

