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
     */
    UnitSchema.statics.all = () => this.find({});


    UnitSchema.methods.add = (userId, useLog, req, res) => {
        // validando os dados da unidade em req.body.unit
        if (!!req.body.unit.name && !!req.body.unit.address.street && !!req.body.unit.address.number && !!req.body.unit.address.neighborhood && !!req.body.unit.address.city && !!req.body.unit.address.state && !!req.body.unit.address.country && !!req.body.unit.address.postalCode && !!req.body.unit.address.enabled && !!req.body.unit.cnpj && !!req.body.unit.alias && !!req.body.unit.phone && !!req.body.unit.website && !!req.body.unit.directorAuthorization && !!req.body.unit.secretaryAuthorization) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // Criando unidade
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

    UnitSchema.methods.update = (userId, useLog, req, res) => {
        // validando os dados da unidade em req.body.unit
        if (!!req.body.unit.name && !!req.body.unit.address.street && !!req.body.unit.address.number && !!req.body.unit.address.neighborhood && !!req.body.unit.address.city && !!req.body.unit.address.state && !!req.body.unit.address.country && !!req.body.unit.address.postalCode && !!req.body.unit.address.enabled && !!req.body.unit.cnpj && !!req.body.unit.alias && !!req.body.unit.phone && !!req.body.unit.website && !!req.body.unit.directorAuthorization && !!req.body.unit.secretaryAuthorization) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // Atualizando unidade
        // 'This': contendo os métodos do mongodb
        this.find({/* filtro */})
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