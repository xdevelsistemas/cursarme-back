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

    const DocsCourse = new Schema({
        name : { type: String, required: true }
    });

    /**
     * model Schema
     */
    let TypeCourseSchema = xDevSchema.extend({
        name: {type: String, required: true},
        /**
         * Unidade o curso
         */
        unit: { type: Schema.Types.ObjectId, ref : xDevModel.ref(client, 'Unit') , required: true }
    });

    /**
     * enabling caching
     */
    TypeCourseSchema.set('redisCache', true);

    /**
     * Busca um tipo de curso
     * @param _id
     * @returns {*|Query|Promise}
     */
    TypeCourseSchema.statics.findById = function(_id) {
        return this.findOne({_id: _id});
    };

    /**
     * Busca todos os tipos de curso
     * @returns {*}
     */
        // TODO Converter o bloco de código abaixo para es6
        // mantido código no formato antigo por problemas de escopo com o modelo
    TypeCourseSchema.statics.all = function() { return this.find({})};


    /**
     * Adiciona um novo tipo de curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    TypeCourseSchema.statics.add = function(userId, useLog, entity, data) {
        let type = this();

        type.name = data.name;
        type.unit = data.unit;

        return xDevSchema._add(entity, type, userId, useLog, 1, 'Tipo de curso adicionado');
    };


    /**
     * Atualiza um tipo de curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    TypeCourseSchema.statics.update = function(userId, useLog, entity, data) {
        let StudentModel = this;

        return StudentModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Tipo de curso atualizado');
            })
    };

    /**
     * Remove um tipo de curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    TypeCourseSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'TypeCourse',TypeCourseSchema);
}