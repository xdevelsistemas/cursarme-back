/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */


module.exports = callModule();


function callModule(){
    "use strict";


    const mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    let extend = require('mongoose-schema-extend');
    const xDevSchema = require("lib/xDevEntity").xDevSchema;
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


    let ConfSchema = new Schema({
    //todo modelar configuracao
    });

    let IuguConfSchema = new Schema({
    //todo modelar configuracao do iugu
        /* Determine a multa a ser cobrada para pagamentos efetuados após a data de vencimento */
        late_payment_fine : { type: Number , require: true },
        /* Booleano para Habilitar ou Desabilitar multa por atraso de pagamento */
        fines : {type: Boolean, required: true, default: true},

    });

    /**
     * model Schema
     */
    let ClientSchema = new xDevSchema.extend({
        name : String,
        alias: String,
        tax: { type: Number , require: true },
        cpfcnpj: { type: String, unique: true , require: true },
        user: { type: Schema.Types.ObjectId, ref : 'User' , require: true },
        iuguConf: {type : IuguConfSchema},
        conf: {type : ConfSchema}
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
    
    
