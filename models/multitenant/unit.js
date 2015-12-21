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


    UnitSchema.methods.add = (userId,useLog) => {
        return xDevSchema.prototype.add(this,userId,useLog);
    };

    UnitSchema.methods.update = (userId,useLog) => {
        return xDevSchema.prototype.update(this,userId,useLog);
    };



    return xDevModel.model(client,'Unit',UnitSchema);
}