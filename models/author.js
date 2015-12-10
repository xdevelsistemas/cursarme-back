// models/author.js
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Author', schema);