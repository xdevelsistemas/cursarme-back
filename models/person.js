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
    const xDevSchema = require("../models/multitenant/lib/xDevEntity")().xDevSchema;
    const AddressSchema = require("../models/lib/Address");
    const ContactSchema = require("../models/lib/contact");
    const maritalStatus = require("../models/enum/maritalStatus");
    const gender = require("../models/enum/gender");
    const ethnicity = require("../models/enum/ethnicity");



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

    const PhoneSchema = new Schema({
        description : { type: String, required: true },
        phone : { type: String, required: true }
    });

    return  xDevSchema.extend({
        name: { type: String, required: true },
        address: [AddressSchema],
        birthDate: { type: Date, required: true },
        cpf: { type: String, unique: true , required: true },
        rg: { type: String, required: false },
        phones: [PhoneSchema],
        user: { type: Schema.Types.ObjectId, ref : 'User' , required: true },
        maritalStatus: { type: String , required: true , array: maritalStatus.options },
        gender: { type: String , required: true , array: gender.options },
        ethnicity: { type: String , required: true , array: ethnicity.options },
        contacts : [ContactSchema],
        documents: [DocSchema]
    });
}