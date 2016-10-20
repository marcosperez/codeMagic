var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;
console.log("conectando....");
mongoose.connect('mongodb://127.0.0.1/codeMagic');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function(){
    console.info("trying to establish a connection to mongo");
});

module.exports = mongoose;
