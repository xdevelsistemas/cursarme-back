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

    /**
     * Busca um tipo de curso
     * @param _id
     * @returns {*|Query|Promise}
     */
    AreaSchema.statics.findById = function(_id) {
        return this.findOne({_id: _id});
    };

    /**
     * Busca todas as areas dos cursos
     * @returns {*}
     */
        // TODO Converter o bloco de código abaixo para es6
        // mantido código no formato antigo por problemas de escopo com o modelo
    AreaSchema.statics.all = function() { return this.find({})};


    /**
     * Adiciona uma area
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    AreaSchema.statics.add = function(userId, useLog, entity, data) {
        let area = this();

        area.name = data.name;
        area.unit = data.unit;
        area.typeCourse = data.typeCourse;

        return xDevSchema._add(entity, area, userId, useLog, 1, 'Area adicionada');
    };


    /**
     * Atualiza uma area
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    AreaSchema.statics.update = function(userId, useLog, entity, data) {
        return this.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Area atualizada');
            })
    };

    /**
     * Remove uma area
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    AreaSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Area',AreaSchema);
}