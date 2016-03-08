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
    const AddressSchema = require("../lib/Address");




    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    let UnitSchema = xDevSchema.extend({
        name: String,
        address : AddressSchema,
        cnpj: { type: String, unique: true , required: true },
        /*
         nome fantasia
         */
        alias: { type: String , required: true },
        phone: { type: String , required: true },
        website: { type: String , required: true },
        /*
          fk com entidade dentro da empresa
        */
        director: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Employee') , required: false },
        /*
         autorizacao do diretor da escola (numero)
         */
        directorAuthorization :{ type: String , required: true },
        /*
         fk com entidade dentro da empresa
         */
        secretary: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Employee') , required: false },
        /*
         autorizacao da secretaria da escola (numero)
         */
        secretaryAuthorization :{ type: String , required: true }
    });

    /**
     * enabling caching
     */
    UnitSchema.set('redisCache', true);

    /**
     * Lista todas as unidades
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    UnitSchema.statics.all = function() { return this.find({})};

    /**
     * Busca uma unidade
     * @param id Id da unidade para a busca
     * @returns {*|Query|Promise}
     */
    UnitSchema.statics.findById = function(id) { return this.findOne({"_id": id})};

    /**
     * Cria uma unidade
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    UnitSchema.statics.add = function(userId, useLog, entity, data) {
        let unit = this();

        unit.name = data.name;
        unit.address = data.address;
        unit.cnpj = data.cnpj;
        unit.alias = data.alias;
        unit.phone = data.phone;
        unit.website = data.website;
        unit.director = data.director;
        unit.directorAuthorization = data.directorAuthorization;
        unit.secretary = data.secretary;
        unit.secretaryAuthorization = data.secretaryAuthorization;

        return xDevSchema._add(entity, unit, userId, useLog, 1, 'Unidade adicionada');
    };

    /**
     * Atualiza uma unidade
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    UnitSchema.statics.update = function(userId, useLog, entity, data) {
        let UnitModel = this;

        return UnitModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result.toJSON(), userId, useLog, 0, 'Unidade atualizada');
            })
    };

    /**
     * Remove uma unidade
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    UnitSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Unit',UnitSchema);
}