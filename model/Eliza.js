var mongoose = require('mongoose');  
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose);



var elizaSchema = new mongoose.Schema({  
  user_id: Number,
  date: { type: Date, default: Date.now },
  convo : { type : Array , "default" : [] }
});


elizaSchema.plugin(autoIncrement.plugin, 'Convo');
mongoose.model('Convo', elizaSchema);