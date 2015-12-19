/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    let Schema = mongoose.Schema;
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


    DeveloperSchema.methods.add = (userId,useLog) => {
        return xDevSchema.prototype.add(this,userId,useLog);
    };

    DeveloperSchema.methods.update = (userId,useLog) => {
        return xDevSchema.prototype.update(this,userId,useLog);
    };



    return xDevModel.model(client,'Developer',DeveloperSchema);
}