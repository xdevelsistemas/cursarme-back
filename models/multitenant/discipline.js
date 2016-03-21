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
    let DisciplineSchema = xDevSchema.extend({
        name: {type: String, required: true},
        value: { type: Number , required: true }
    });

    /**
     * enabling caching
     */
    DisciplineSchema.set('redisCache', true);

    /**
     * Busca todas as disciplinas
     * @returns {*}
     */
        // TODO Converter o bloco de código abaixo para es6
        // mantido código no formato antigo por problemas de escopo com o modelo
    DisciplineSchema.statics.all = function() { return this.find({})};


    /**
     * Busca uma disciplina
     * @param id
     * @returns {*|Query|Promise}
     */
    DisciplineSchema.statics.findById = function(id) { return this.findOne({"_id": id})};

    /**
     * Adiciona uma disciplina
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    DisciplineSchema.statics.add = function(userId, useLog, entity, data) {
        let disc = this();

        disc.name = data.name;
        disc.value = data.value;

        return xDevSchema._add(entity, disc, userId, useLog, 1, 'Disciplina adicionada');
    };

    /**
     * Atualiza uma disciplina
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    DisciplineSchema.statics.update = function(userId, useLog, entity, data) {
        let EmployeeModel = this;

        return EmployeeModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Disciplina atualizada');
            })
    };

    /**
     * Remove uma disciplina
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    DisciplineSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Discipline',DisciplineSchema);
}