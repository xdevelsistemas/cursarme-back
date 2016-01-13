/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;


function callModule() {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const MongooseErr = require("../services/MongooseErr");
    const _ = require('lodash');


    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');


    let SMschema = new Schema({
        clientname: {
            type: String
        },
        config: {
            type: Array
        }
    });


    /**
     * enabling caching
     */
    SMschema.set('redisCache', true);


// methods ======================
// get social
    SMschema.statics.authSocial = (social, res) => {
        return this.findOne({'clientname': social},
            (err, auth) => {
                if (!!auth) {
                    return auth;
                } else {
                    if (!!err) {
                        console.error(err);
                        return res.status(500).json(err);
                    }
                }
            }
        );
    };


//has social
    SMschema.statics.hasSocial = (social) => {
        return this.findOne({'clientname': social},
            (err, auth) => {
                return !!err ? false : !!auth;
            }
        );
    };


    return mongoose.model('SocialMedia', SMschema);
}