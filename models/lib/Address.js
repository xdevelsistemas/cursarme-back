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
        street : { type: String , required : true } ,
        number : { type: String , required : true } ,
        complement: { type: String , required : false } ,
        neighborhood : { type: String , required : true } ,
        city : { type: String , required : true } ,
        state : { type: String , required : true } ,
        country: { type: String , required : true } ,
        postalCode : { type: String , required : true },
        enabled : { type: Boolean , required : true , default: true },
        description: { type: String, required: true},
        default: { type: Boolean, required: true, default: true}
    });
}