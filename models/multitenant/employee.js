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
    const xDevSchema = require("./lib/xDevEntity")(client).xDevSchema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const PersonSchema = require("../person");
    const modules = require("../enum/modules");
    const _ = require('lodash');



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    const PermSchema = new Schema({
        unit: {type: Schema.Types.ObjectId , ref: xDevModel.ref(client,'Unit') , required: true},
        modules: [{type: String, enum : modules.options}]
    });

    /**
     * model Schema
     */
    let EmployeeSchema = PersonSchema.extend({
        user: { type: Schema.Types.ObjectId, ref : 'User' , required: true },
        admin: {type: Boolean, required: true , default: false},
        enabled: {type: Boolean, required: true , default: true},
        /*
          cargo
         */
        position: {type: String, required: true },
        /*
           titulação
         */
        titration: {type: String, required: true },
        /*
          unidades que terão acesso
        */
        perms: [PermSchema]
    });


    /**
     * enabling caching
     */
    EmployeeSchema.set('redisCache', true);

    /**
     * Busca todos os funcionários
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    EmployeeSchema.statics.all = function() { return this.find({})};


    /**
     * Busca uma unidade
     * @param id Id da unidade para a busca
     * @returns {*|Query|Promise}
     */
    EmployeeSchema.statics.findById = function(id) { return this.findOne({"_id": id})};

    /**
     * Adiciona um funcionário
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>}
     */
    EmployeeSchema.statics.add = function(userId, useLog, entity, data) {
        let empl = this();

        empl.admin = data.admin;
        empl.enabled = data.enabled;
        empl.position = data.position;
        empl.titration = data.titration;
        empl.perms = data.perms;
        empl.name = data.name;
        empl.address = data.address;
        empl.birthDate = data.birthDate;
        empl.cpf = data.cpf;
        empl.phones = data.phones;
        empl.user = data.user;
        empl.maritalStatus = data.maritalStatus;
        empl.gender = data.gender;
        empl.ethnicity = data.ethnicity;
        empl.contacts = data.contacts;
        empl.documents = data.documents;

        return xDevSchema._add(entity, empl, userId, useLog, 1, 'Unidade adicionada');
    };

    /**
     * Atualiza os dados do funcionário
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    EmployeeSchema.statics.update = function(userId, useLog, entity, data) {
        let EmployeeModel = this;

        return EmployeeModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Unidade atualizada');
            })
    };


    return xDevModel.model(client,'Employee',EmployeeSchema);
}