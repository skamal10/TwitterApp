var fs = require('fs');
var mongoose = require("mongoose");
var Grid = require('gridfs-stream');
var GridFS = Grid(mongoose.connection.db, mongoose.mongo);

function putFile(path, name, callback) {
    var writestream = GridFS.createWriteStream({
        filename: name
    });
    writestream.on('close', function (file) {
      callback(null, file);
    });
    fs.createReadStream(path).pipe(writestream);
}