// models/shop.js
var mongoose = require('mongoose');

var shopSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    icon_url: {
        type: String,
        required: true
    },
    lomadee: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Shop', shopSchema);
