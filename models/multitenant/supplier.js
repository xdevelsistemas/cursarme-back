/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    let extendObj = require('extend');
    const Schema = mongoose.Schema;
    const xDevSchema = require("../multitenant/lib/xDevEntity")(client).xDevSchema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');
    const PersonSchema = require("../person");
    const modules = require("../enum/modules");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');



    /**
     * model Schema
     */
    let SupplierSchema = PersonSchema.extend({
        cnpj: {type: String, required: true , unique: true}

    });


    /**
     * enabling caching
     */
    SupplierSchema.set('redisCache', true);


    return xDevModel.model(client,'Student',SupplierSchema);
}