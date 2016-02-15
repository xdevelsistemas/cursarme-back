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
    const PersonSchema = require("../person");
    const modules = require("../enum/modules");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');



    /**
     * model Schema
     */
    let SupplierSchema = PersonSchema.extend({
        /**
         * nome fantasia
         */
        alias: { type: String , required: true },
        description: { type: String , required: false }
    });


    /**
     * enabling caching
     */
    SupplierSchema.set('redisCache', true);


    /**
     * Busca todos os fornecedores
     * @returns {*}
     */
        // TODO Converter o bloco de código abaixo para es6
        // mantido código no formato antigo por problemas de escopo com o modelo
    SupplierSchema.statics.all = function() { return this.find({})};


    /**
     * Adiciona um fornecedor
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    SupplierSchema.statics.add = function(userId, useLog, entity, data) {
        let suppl = this();

        suppl.name = data.name;
        suppl.alias = data.alias;
        suppl.address = data.address;
        suppl.birthDate = data.birthDate;
        suppl.cpf = data.cnpj;   // podemos juntar e formar um atributo só em Pessoa(ex.: cpfCnpj)
        suppl.rg = data.rg;
        suppl.phones = data.phones;
        suppl.user = data.user;
        suppl.maritalStatus = data.maritalStatus;
        suppl.gender = data.gender;
        suppl.ethnicity = data.ethnicity;
        suppl.contacts = data.contacts;
        suppl.documents = data.documents;

        return xDevSchema._add(entity, suppl, userId, useLog, 1, 'Funcionário adicionado');
    };


    /**
     * Atualiza um fornecedor
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    SupplierSchema.statics.update = function(userId, useLog, entity, data) {
        let SupplierModel = this;

        return SupplierModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Funcionário atualizado');
            })
    };

    /**
     * Remove um fornecedor
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    SupplierSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Student',SupplierSchema);
}