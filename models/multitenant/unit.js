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
        director: { type: Schema.Types.ObjectId, ref: client + 'Employee' , required: false },
        /*
         autorizacao do diretor da escola (numero)
         */
        directorAuthorization :{ type: String , required: true },
        /*
         fk com entidade dentro da empresa
         */
        secretary: { type: Schema.Types.ObjectId, ref: client + 'Employee' , required: false },
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
     * Busca todas as unidades
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    UnitSchema.statics._all = function() { return this.find({})};

    /**
     * Cria uma unidade
     * @param userId
     * @param useLog
     * @param entity
     * @param req
     * @param res
     * @returns {*}
     */
    UnitSchema.methods._add = function(userId, useLog, entity, req) {
        /*let unit = this;*/
        let unit = new UnitSchema();

        //todo verificar/adiconar valores para a nova unidade
        extendObj(true, unit, req.body.unit);
        return xDevSchema._add(entity, unit, userId, useLog, 1, 'Unidade criada');
    };

    /**
     * Atualiza uma unidade
     * @param userId
     * @param useLog
     * @param entity
     * @param req
     * @param res
     * @returns {*}
     */
    UnitSchema.methods._update = (userId, useLog, entity, req, res) => {
        // validando os dados da unidade em req.body.unit
        if (!ValidValues.validValues(req.body.unit)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // Atualizando unidade
        // 'This': contendo os métodos do mongodb
        this.find({_id: req.body.unit._id})
            .then((data) => {
                // Agora com os dados encontrados, xDevEntity recebe no primeiro parâmetro
                return xDevSchema.prototype._update(entity, data, userId, useLog, 0, 'Unidade atualizada');
            })
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    return xDevModel.model(client,'Unit',UnitSchema);
}