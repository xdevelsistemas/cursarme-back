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
module.exports = callModule();



function callModule() {
    "use strict";

    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const LogSchema = require("../log");
    const ClientSchema = require("../../Client");


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

    xDevEntity.xDevSchema.add = (obj, userId, useLog, client, op, text) => {
        obj.user_created = userId;
        obj.date_created = new Date();

        if (useLog){

            //todo colocar insercao na tabela log
            LogSchema(client).createLog(client, obj, userId, op, text);
        }

        // Salvando a adição de user_created e date_created
        obj.save((err) => {
            if(!!err) {
                console.error(err);
            }
        });
        return obj;
    };

    xDevEntity.xDevSchema.update = (obj, userId, useLog, client, op, text) => {
        // Guardando o userId e a data/hora que o obj foi alterado
        obj.user_updated = userId;
        obj.date_updated = new Date();

        if (useLog){

            //todo colocar insercao na tabela log
            LogSchema(client).createLog(client, obj, userId, op, text);
        }

        // Salvando as alterações dos dados e a adição de user_updated e date_updated
        obj.save((err) => {
            if(!!err) {
                console.error(err);
            }
        });
        return obj;
    };


    return xDevEntity
}