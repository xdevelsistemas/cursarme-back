/**
 * xdevel sistemas escaláveis - book4you
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
require('mongoose-multitenant');
var mongooseRedisCache = require("../../config/mongooseRedisCache");
var ObjectId = mongoose.Schema.Types.ObjectId;
var toObjectId = require('mongoose').Types.ObjectId;
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var format = require('string-format');
var ses = require('nodemailer-ses-transport');
var nodemailer = require('nodemailer');
var awsConf = require('../../config/aws');
var MongooseErr = require("../../services/MongooseErr");
var _ = require('lodash');

/**
 * padrão - utilizando bluebird como promise
 */
mongoose.Promise = require('bluebird');

/**
 * model Schema
 */
var unidadeSchema = mongoose.Schema({
    nome : String,
    cnpj: { type: String, unique: true , require: true }
});


/**
 * enabling caching
 */
unidadeSchema.set('redisCache', true);


/**
 * export the model Schema
 * @type {Aggregate|Model|*|{}}
 */
module.exports = mongoose.mtModel('Unidade', unidadeSchema);