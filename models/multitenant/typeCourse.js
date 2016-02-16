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
    const ValidValues = require("../../services/validValues");
    const _ = require('lodash');




    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    let TypeCourseSchema = xDevSchema.extend({
        name: {type: String, required: true},
        /**
         * Unidade o curso
         */
        unit: { type: Schema.Types.ObjectId, ref : client + 'Unit' , required: true },
        /**
         * Quantidade de alunos para o curso
         */
        quorum: {type: Number, required: true}
    });

    /**
     * enabling caching
     */
    TypeCourseSchema.set('redisCache', true);


    return xDevModel.model(client,'TypeCourse',TypeCourseSchema);
}