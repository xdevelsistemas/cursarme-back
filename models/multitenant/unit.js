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
    const xDevSchema = require("../lib/xDevEntity").xDevSchema;
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


    UnitSchema.methods.add = (userId, useLog, req, res) => {

        // Verificando se os dados estão corretos
        /*if (!!req.body.name && !!req.body.address.street && !!req.body.address.number && !!req.body.address.neighborhood && !!req.body.address.city && !!req.body.address.state && !!req.body.address.country && !!req.body.address.postalCode && !!req.body.address.enabled && !!req.body.cnpj && !!req.body.alias && !!req.body.phone && !!req.body.website && !!req.body.directorAuthorization && !!req.body.secretaryAuthorization) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        // Criando nova unidade
        // 'This': contendo métodos do mongodb
        this.create(req.body)
            .then(function(data) {
                //
                return xDevSchema.prototype.add(data, userId, useLog);
            })
            .then(function(result){
                return res.status(201).json(result);
            })
            .catch(function (err) {
                //
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    UnitSchema.methods.update = (userId, useLog, req, res) => {
        // validando os dados de req.body da requisição
        /*if (!!req.body.name && !!req.body.address.street && !!req.body.address.number && !!req.body.address.neighborhood && !!req.body.address.city && !!req.body.address.state && !!req.body.address.country && !!req.body.address.postalCode && !!req.body.address.enabled && !!req.body.cnpj && !!req.body.alias && !!req.body.phone && !!req.body.website && !!req.body.directorAuthorization && !!req.body.secretaryAuthorization) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        // 'This': contendo os métodos do mongodb
        this.find({/* filtro */})
        .then(function(data) {
            // Agora com os dados encontrados, xDevEntity recebe no primeiro parâmetro
            return xDevSchema.prototype.update(data, userId, useLog, res);
        })
        .then(function(result) {
            return res.status(201).json(result);
        })
        .catch(function(err) {
            return MongooseErr.apiGetMongooseErr(err, res);
        })
    };

    return xDevModel.model(client,'Unit',UnitSchema);
}