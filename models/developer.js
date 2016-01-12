/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    let extend = require('mongoose-schema-extend');
    const xDevSchema = require("lib/xDevEntity").xDevSchema;
    const xDevModel = require("../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const MongooseErr = require("../services/MongooseErr");
    const _ = require('lodash');
    const PersonSchema = require("person");
    const modules = require("enum/modules");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');


    /**
     * model Schema
     */
    let DeveloperSchema = PersonSchema.extend({
        enabled: {type: Boolean, required: true , default: true}
    });


    /**
     * enabling caching
     */
    DeveloperSchema.set('redisCache', true);


    DeveloperSchema.methods.add = (userId, useLog, req, res) => {
        //
        this.create(req.body)
            .then((data) => {
                //
                return xDevSchema.prototype.add(data, userId, useLog);
            })
            .then((result) => {
                return res.status(201).json(result);
            })
            .catch((err) =>
                //
                MongooseErr.apiGetMongooseErr(err, res));
    };

    DeveloperSchema.methods.update = (userId, useLog, req, res) => {
        //
        this.find({/* filtro */})
            .then((data) => {
                // Agora com os dados encontrados, xDevEntity recebe no primeiro parâmetro
                return xDevSchema.prototype.update(data, userId, useLog, res);
            })
            .then((result) => {
                return res.status(200).json(result);
            })
            .catch((err) =>
                MongooseErr.apiGetMongooseErr(err, res));
    };



    return xDevModel.model(client,'Developer',DeveloperSchema);
}