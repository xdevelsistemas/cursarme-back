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
    let StudentSchema = PersonSchema.extend({
        matNumber: {type: String, required: true , unique: true}
    });


    /**
     * enabling caching
     */
    StudentSchema.set('redisCache', true);


    /**
     * Busca todos os estudantes
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    StudentSchema.statics.all = function() { return this.find({})};


    /**
     * Adiciona um novo estudate
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    StudentSchema.statics.add = function(userId, useLog, entity, data) {
        let stud = this();

        stud.matNumber = data.matNumber;
        stud.name = data.name;
        stud.address = data.address;
        stud.birthDate = data.birthDate;
        stud.cpf = data.cpf;
        stud.rg = data.rg;
        stud.phones = data.phones;
        stud.user = data.user;
        stud.maritalStatus = data.maritalStatus;
        stud.gender = data.gender;
        stud.ethnicity = data.ethnicity;
        stud.contacts = data.contacts;
        stud.documents = data.documents;

        return xDevSchema._add(entity, stud, userId, useLog, 1, 'Estudante adicionado');
    };


    /**
     * Atualiza um estudante
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    StudentSchema.statics.update = function(userId, useLog, entity, data) {
        let StudentModel = this;

        return StudentModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Estudante atualizado');
            })
    };

    /**
     * Remove um estudante
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    StudentSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };



    return xDevModel.model(client,'Student',StudentSchema);
}