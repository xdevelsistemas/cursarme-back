/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    const extendObj = require('extend');
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
    let AreaSchema = xDevSchema.extend({
        name: {type: String, required: true},
        /**
         * Unidade
         */
        unit: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Unit'), required: true },
        /**
         * Tipo de curso
         */
        typeCourse: { type: Schema.Types.ObjectId, ref : xDevModel.ref(client, 'TypeCourse') , required: true }
    });

    /**
     * enabling caching
     */
    AreaSchema.set('redisCache', true);


    return xDevModel.model(client,'Area',AreaSchema);
}