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
    const UserModel = require('../../models/user');
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');
    const PersonSchema = require("../person");
    const modules = require("../enum/modules");
    const studentStatus = require("../enum/studentStatus");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');



    /**
     * model Schema
     */
    let StudentSchema = PersonSchema.extend({
        matNumber: {type: String, required: true , unique: true},
        user: { type: Schema.Types.ObjectId, ref : 'User' , required: true },
        status: {type: String , required: true , array: studentStatus.options, default: "preEnrolled"}
    });


    /**
     * enabling caching
     */
    StudentSchema.set('redisCache', true);

    /**
     * Busca um aluno pelo id, nome ou matrícula
     * @param data
     * @returns {*|Query|Promise}
     */
    StudentSchema.statics.findById = function(data) {
        return this.findOne({$or: [{_id: data._id}, {matNumber: data.matNumber}, {cpf: data.cpf}]});
    };

    /**
     * Busca todos os alunos
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
        let user;

        stud.matNumber = data.matNumber;
        stud.email = data.email;
        stud.name = data.name;
        stud.address = data.address;
        stud.birthDate = data.birthDate;
        stud.cpf = data.cpf;
        stud.rg = data.rg;
        stud.phones = data.phones;
        stud.maritalStatus = data.maritalStatus;
        stud.gender = data.gender;
        stud.ethnicity = data.ethnicity;
        stud.contacts = data.contacts;
        stud.documents = data.documents;

        user = {
            name: data.name,
            email: data.email,
            cpf: data.cpf
        };

        return UserModel.add(userId, true, 'Test', user)
            .then((data) => {
                stud.user = data._id;
                user = data;
                return xDevSchema._add(entity, stud, userId, useLog, 1, 'Aluno adicionado');
            })
            .catch(() => {
                UserModel.delete(userId, true, 'Test', user);
            });
    };


    /**
     * Atualiza um aluno
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
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Aluno atualizado');
            })
    };

    /**
     * Remove um aluno
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    StudentSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };

    StudentSchema.statics.verifCpf = function(cpf) {
        // TOdo definir buscador

    };


    return xDevModel.model(client,'Student',StudentSchema);
}