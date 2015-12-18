/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');
    const AdressSchema = require("../lib/address");


    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    let UnitSchema = new Schema({
        name : String,
        address : AdressSchema,
        cnpj: { type: String, unique: true , require: true }
    });
    /**
     * enabling caching
     */
    UnitSchema.set('redisCache', true);



    return xDevModel.model(client,'Unit',UnitSchema);
}