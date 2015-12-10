// models/readlist.js
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    descricao: {
        type: String,
        required: true
    },
    icon_url: {
        type: String
    },
    imagem_url : {
        type: String
    },
    publico: {
        type: Boolean
    },
    categoria: {
        type: Array,
        required: true
    },
    visivel: {
        type: Boolean
    }
});

module.exports = mongoose.model('Readlist', schema);