/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callmodule;



function callmodule(client) {
    "use strict";

    var mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');

    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    const UnidadeSchema = new Schema({
        nome : String,
        cnpj: { type: String, unique: true , require: true }
    });
    /**
     * enabling caching
     */
    UnidadeSchema.set('redisCache', true);



    return xDevModel.model(client,'Unidade',UnidadeSchema);
}