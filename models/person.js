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
    const maritalStatus = require("enum/maritalStatus");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    const DocSchema = new Schema({
        description : { type: String, required: true },
        imageUrl : { type: String, required: true }
    });

    return  xDevSchema.extend({
        name: { type: String, required: true },
        address: [AddressSchema],
        cpf: { type: String, unique: true , required: true },
        rg: { type: String, required: false },
        phone: { type: String , required: true },
        user: { type: Schema.Types.ObjectId, ref : 'User' , required: true },
        maritalStatus: { type: String , required: true , array: maritalStatus.options },
        contacts : [ContactSchema],
        documents: [DocSchema]
    });
}