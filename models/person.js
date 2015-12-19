/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule();



function callModule() {
    "use strict";

    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    const Schema = mongoose.Schema;
    const xDevSchema = require("lib/xDevEntity").xDevSchema;
    const AddressSchema = require("lib/address");
    const ContactSchema = require("lib/contact");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    return  xDevSchema.extend({
        name: String,
        address: [AddressSchema],
        cpf: { type: String, unique: true , required: true },
        phone: { type: String , required: true },
        user: { type: Schema.Types.ObjectId, ref : 'User' , required: true },
        contacts : [ContactSchema]
    });
}