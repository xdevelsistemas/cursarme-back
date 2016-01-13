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
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const mongooseRedisCache = require("../config/mongooseRedisCache");
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

    let PLschema = mongoose.Schema({
        users: {
            type: Array
        },
        suffix: {
            type: String
        }
    });

    /**
     * enabling caching
     */
    PLschema.set('redisCache', true);


    PLschema.statics.validPerm = (email) => {
        let include = (arr, obj) => (arr.indexOf(obj) != -1);

        let testSuffix = (email, suffix) => (suffix.length != 0 && suffix != '*') ? email.match(suffix) : true;

        let testUsers = (email, users) => users.length != 0 ? include(users, email) : true;

        return this.find()
            .then(
                (perms) => (testSuffix(email, perms[0]._doc.suffix) && testUsers(email, perms[0]._doc.users)),
                (erro) => {
                    console.error(erro);
                    res.status(500).json(erro);
                }
            );
    };


    return mongoose.model('PermLogin', PLschema);
}