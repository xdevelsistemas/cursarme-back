/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callmodule;


function callmodule(client) {
    "use strict";

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const mongooseRedisCache = require('../../config/mongooseRedisCache');
    const MongooseErr = require("../../services/MongooseErr");

    let _ = require('lodash');

    /**
     * padrão - utilizando bluebird como promise
    */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     * vazio por não ter restrição do tipo de dado e será um objeto que está sendo feito o log
     */
    const DataSchema = new Schema({});

    let LogSchema = new Schema({
        unidade: { type: Schema.Types.ObjectId, ref: client + '.' + 'unidade', require: true },
        op: { type: Number, require: true },
        entity: { type: String, require: true },
        data: { type: DataSchema, require: true },
        text: { type: String, require: true },
        date: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: 'user', require: true }
    });


    LogSchema.statics.createLog = function(entity,obj,text,userId,op) {
        const log = new LogSchema();
        log.op = op;
        log.data = obj;
        log.entity = entity;
        log.text = text;
        log.user = userId;
        log.date = new Date();
        log.save();
        return log;
    };

    /**
     * enabling caching
     */
    LogSchema.set('redisCache', true);

    /**
     * return schema
     */
    return mongoose.model(client + '.' +  'Log', LogSchema);
}


