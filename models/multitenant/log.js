/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callmodule;


function callmodule(client) {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const mongooseRedisCache = require('../../config/mongooseRedisCache');
    const MongooseErr = require("../../services/MongooseErr");

    const _ = require('lodash');

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
        unidade: { type: Schema.Types.ObjectId, ref: client + '.' + 'unidade', required: true },
        op: { type: Number, required: true },
        entity: { type: String, required: true },
        data: { type: DataSchema, required: true },
        text: { type: String },
        date: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true }
    });


    LogSchema.statics.createLog = (entity,obj,text,userId,op) => {
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


