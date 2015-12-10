// models/conf-admin.js
var mongoose = require('mongoose');

var schema = mongoose.Schema({
    chave_api: {
        type: String
    },
    chave_referencia: {
        type: String
    }
});

schema.statics.getConf = function() {
    var ConfModel = this;
    return ConfModel.findOne();
};


module.exports = mongoose.model('ConfAdmin', schema);
