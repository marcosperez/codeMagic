var mongoose = require('mongoose');
var Promise = require('bluebird');

mongoose.Promise = Promise;

mongoose.connect('mongodb://localhost/codeMagic');

module.exports = mongoose;
