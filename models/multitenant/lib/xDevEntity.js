/**
 * Created by clayton on 11/12/15.
 */
/**
 * extendendo o objeto antes de persistir com dados padrões
 * @param obj objeto que vai realizar a persistencia
 * @param userId usuario
 * @param op operacao
 */

/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const LogSchema = require("../log")(client);
    const ClientSchema = require("../../Client");


    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    let xDevEntity = {};

    /**
     * model Schema
     */
    xDevEntity.xDevSchema = new Schema({
        user_created: {type: String, required: true},
        date_created: {type: Date, required: true , default : Date.now},
        user_updated: {type: String, required: false},
        date_updated: {type: Date, required: true , default : Date.now}
    });


    /**
     * Cria logs de alterações no banco
     * @param entity
     * @param obj
     * @param userId
     * @param op
     * @param text
     * @private
     */
    let _createLog = (entity, obj, userId, op, text) => {
        LogSchema.createLog(entity, obj, userId, op, text);
    };


    /**
     * Adiciona um novo registro no banco
     * @param entity
     * @param obj
     * @param userId
     * @param useLog
     * @param op
     * @param text
     * @returns {Promise.<T>}
     * @public
     */
    xDevEntity.xDevSchema._add = (entity, obj, userId, useLog, op, text) => {
        obj.user_created = userId;
        obj.date_created = new Date();

        if (useLog){

            //todo colocar insercao na tabela log
            _createLog(entity, obj, userId, op, text);
        }

        // Salvando a adição de user_created e date_created
        return obj.save()
        .catch((err) => {
            if(!!err) {
                console.error(err);
            }
        });
    };


    /**
     * Atualiza um registro do banco
     * @param entity
     * @param obj
     * @param userId
     * @param useLog
     * @param op
     * @param text
     * @returns {Promise.<T>}
     * @public
     */
    xDevEntity.xDevSchema._update = (entity, obj, userId, useLog, op, text) => {
        // Guardando o userId e a data/hora que o obj foi alterado
        obj.user_updated = userId;
        obj.date_updated = new Date();

        if (useLog){

            //todo colocar insercao na tabela log
            _createLog(entity, obj, userId, op, text);
        }

        // Salvando as alterações dos dados e a adição de user_updated e date_updated
        return obj.save()
        .catch((err) => {
            if(!!err) {
                console.error(err);
            }
        });
    };


    return xDevEntity
}