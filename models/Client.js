/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */


module.exports = callModule();


function callModule(){
    "use strict";


    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const ObjectId = mongoose.Schema.Types.ObjectId;
    const toObjectId = require('mongoose').Types.ObjectId;
    const bcrypt = require('bcrypt-nodejs');
    const async = require('async');
    const crypto = require('crypto');
    const format = require('string-format');
    const ses = require('nodemailer-ses-transport');
    const nodemailer = require('nodemailer');
    const awsConf = require('../config/aws');
    const MongooseErr = require("../services/MongooseErr");
    const _ = require('lodash');

    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    let ClientSchema = new Schema({
        name : String,
        alias: String,
        cpfcnpj: { type: String, unique: true , require: true },
        user: { type: Schema.Types.ObjectId, ref : 'User' , require: true }
    });


    /**
     * enabling caching
     */
    ClientSchema.set('redisCache', true);


    /**
     * export the model Schema
     * @type {Aggregate|Model|*|{}}
     */
    return mongoose.Model('Client', ClientSchema);

}
    
    
