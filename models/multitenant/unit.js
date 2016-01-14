/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    const Schema = mongoose.Schema;
    const xDevSchema = require("../lib/xDevEntity")(client).xDevSchema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const ValidValues = require("../../services/validValues");
    const _ = require('lodash');
    const AddressSchema = require("../lib/address");




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
    UnitSchema.statics.all = () => this.find({});

    /**
     * Cria uma unidade
     * @param userId
     * @param useLog
     * @param req
     * @param res
     * @returns {*}
     */
    UnitSchema.methods.add = (userId, useLog, req, res) => {
        // validando os dados da unidade em req.body.unit
        if (!ValidValues.validValues(req.body.unit)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // Criando uma unidade
        // 'This': contendo métodos do mongodb
        this.create(req.body.unit)
            .then((data) => {
                //
                return xDevSchema.prototype.add(data, userId, useLog);
            })
            .then((result) => {
                return res.status(201).json(result);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    /**
     * Atualiza uma unidade
     * @param userId
     * @param useLog
     * @param req
     * @param res
     * @returns {*}
     */
    UnitSchema.methods.update = (userId, useLog, req, res) => {
        // validando os dados da unidade em req.body.unit
        if (!ValidValues.validValues(req.body.unit)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // Atualizando unidade
        // 'This': contendo os métodos do mongodb
        this.find({_id: req.body.unit._id})
            .then((data) => {
                // Agora com os dados encontrados, xDevEntity recebe no primeiro parâmetro
                return xDevSchema.prototype.update(data, userId, useLog, res);
            })
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    return xDevModel.model(client,'Unit',UnitSchema);
}