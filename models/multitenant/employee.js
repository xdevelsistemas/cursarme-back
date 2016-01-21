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

    const PermSchema = new Schema({
        unit: {type: Schema.Types.ObjectId , ref: xDevModel.ref(client,'Unit') , required: true},
        modules: [{type: String, enum : modules.options}]
    });

    /**
     * model Schema
     */
    let EmployeeSchema = PersonSchema.extend({
        admin: {type: Boolean, required: true , default: false},

        enabled: {type: Boolean, required: true , default: true},
        /*
          cargo
         */
        position: {type: String, required: true },
        /*
           titulação
         */
        titration: {type: String, required: true },
        /*
          unidades que terão acesso
        */
        perms: [PermSchema]
    });


    /**
     * enabling caching
     */
    EmployeeSchema.set('redisCache', true);


    EmployeeSchema.methods.add = (userId,useLog) => {
        return xDevSchema.prototype.add(this,userId,useLog);
    };

    EmployeeSchema.methods.update = (userId,useLog) => {
        return xDevSchema.prototype.update(this,userId,useLog);
    };



    return xDevModel.model(client,'Employee',EmployeeSchema);
}