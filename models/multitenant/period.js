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




    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    let PeriodSchema = xDevSchema.extend({
        // TOdo falta terminar de inserir os campos
        name: {type: String, required: true},
        /**
         * curso
         */
        course: { type: Schema.Types.ObjectId, ref : xDevModel.ref(client, 'Course') , required: true }
    });

    /**
     * enabling caching
     */
    PeriodSchema.set('redisCache', true);


    return xDevModel.model(client,'Period',PeriodSchema);
}