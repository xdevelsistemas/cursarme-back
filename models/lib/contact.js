/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule();



function callModule() {
    "use strict";

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;

    /**
     * model Schema
     */
    return new Schema({
        name : { type: String , required : true } ,
        phone : { type: String , required : true }
    });
}