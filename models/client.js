/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule();


function callModule(){
    "use strict";


    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    const extendObj = require('extend');
    const Schema = mongoose.Schema;
    const xDevSchema = require("../models/multitenant/lib/xDevEntity")().xDevSchema;
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const ObjectId = mongoose.Schema.Types.ObjectId;
    const toObjectId = require('mongoose').Types.ObjectId;
    const bcrypt = require('bcrypt-nodejs');
    const async = require('async');
    const crypto = require('crypto');
    const format = require('string-format');
    const ses = require('nodemailer-ses-transport');
    const nodemailer = require('nodemailer');
    const awsConf = require('../config/aws');
    const MongooseErr = require("../services/MongooseErr");
    const _ = require('lodash');

    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');


    let ConfSchema = new Schema({
    //todo modelar configuracao
    });

    let IuguConfSchema = new Schema({
    //todo modelar configuracao do iugu
        /* Determine a multa a ser cobrada para pagamentos efetuados após a data de vencimento */
        late_payment_fine : { type: Number , require: true },
        /* Booleano para Habilitar ou Desabilitar multa por atraso de pagamento */
        fines : {type: Boolean, required: true, default: true}
    });

    /**
     * model Schema
     */
    let ClientSchema = xDevSchema.extend({
        name : { type: String, required: true},
        alias: { type: String, required: true, unique: true },
        tax: { type: Number , require: true },
        cpfcnpj: { type: String, unique: true , require: true },
        user: { type: Schema.Types.ObjectId, ref : 'User' , require: true },
        iuguConf: {type : IuguConfSchema},
        conf: {type : ConfSchema}
    });


    /**
     * enabling caching
     */
    ClientSchema.set('redisCache', true);


    /**
     * Busca todos os clientes
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    ClientSchema.statics.all = function() { return this.find({})};


    ClientSchema.statics.findById = function(_id) {
        return this.findOne({_id: _id})
    };

    /**
     * Adiciona um cliente
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    ClientSchema.statics.add = function(userId, useLog, entity, data) {
        let client = this();

        client.name  = data.nome;
        client.alias = data.alias;
        client.tax = data.tax;
        client.cpfcnpj = data.cpfcnpj;
        client.user = data.user;
        client.iuguConf = data.iuguConf;
        client.conf = data.conf;

        return xDevSchema._add(entity, client, userId, useLog, 1, 'Cliente adicionado');
    };

    /**
     * Atualiza um cliente
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    ClientSchema.statics.update = function(userId, useLog, entity, data) {
        let ClientModel = this;

        return ClientModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Client atualizado');
            })
    };

    /**
     * Remove um cliente
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    ClientSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    /**
     * export the model Schema
     * @type {Aggregate|Model|*|{}}
     */
    return mongoose.model('Client', ClientSchema);

}