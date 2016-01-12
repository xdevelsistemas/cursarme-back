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
    const xDevSchema = require("../lib/xDevEntity").xDevSchema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');
    const PersonSchema = require("../person");
    const modules = require("../enum/modules");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');



    /**
     * model Schema
     */
    let StudentSchema = PersonSchema.extend({
        matNumber: {type: String, required: true , unique: true}
    });


    /**
     * enabling caching
     */
    StudentSchema.set('redisCache', true);


    StudentSchema.methods.add = (userId,useLog) => {
        return xDevSchema.prototype.add(this,userId,useLog);
    };

    StudentSchema.methods.update = (userId,useLog) => {
        return xDevSchema.prototype.update(this,userId,useLog);
    };



    return xDevModel.model(client,'Student',StudentSchema);
}