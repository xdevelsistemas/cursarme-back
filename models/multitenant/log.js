/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callmodule;


function callmodule(client) {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require('../../config/mongooseRedisCache');
    const MongooseErr = require("../../services/MongooseErr");

    const _ = require('lodash');

    /**
     * padrão - utilizando bluebird como promise
    */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */

    let LogSchema = new Schema({
        op: { type: Number, required: true },
        entity: { type: String, required: true },
        data: { type: Schema.Types.Mixed, required: true },
        text: { type: String },
        date: { type: Date },
        user: { type: Schema.Types.ObjectId, ref: 'user', required: true }
    });

    /**
     * enabling caching
     */
    LogSchema.set('redisCache', true);


    /**
     *
     * @param entity
     * @param obj
     * @param text
     * @param userId
     * @param op
     * @returns {*}
     */
    LogSchema.statics.createLog = function(entity,obj,userId,op,text) {
        // TODO somente this causa erro
        let log = this();
        //const log = new LogSchema();

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
     * return schema
     */
    return xDevModel.model(client, 'Log', LogSchema);
}


