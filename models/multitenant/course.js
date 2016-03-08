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
    let CourseSchema = xDevSchema.extend({
        name: { type: String, required: true },
        /**
         * Tipo do curso
         */
        type_course: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'TypeCourse'), required: true },
        /**
         * Area do curso
         */
        area: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Area'), required: true },
        /**
         * habilitação -
         */
        license: { type: String, required: true },
        /**
         * resolução -
         */
        resolution: { type: String, required: true },
        /**
         * autorização -
         */
        authorization: { type: String, required: true },
        /**
         * reconhecimento -
         */
        recognition: { type: String, required: true }
    });

    /**
     * enabling caching
     */
    CourseSchema.set('redisCache', true);


    /**
     * Busca todos os cursos
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    CourseSchema.statics.all = function() { return this.find({})};

    /**
     * Adiciona um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.add = function(userId, useLog, entity, data) {
        let course = this();

        // TOdo adicoinar campos para os dados de curso
        return xDevSchema._add(entity, course, userId, useLog, 1, 'Curso adicionado');
    };

    /**
     * Atualiza um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.update = function(userId, useLog, entity, data) {
        let CourseModel = this;

        return CourseModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Curso atualizado');
            })
    };

    /**
     * Remove um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Course',CourseSchema);
}