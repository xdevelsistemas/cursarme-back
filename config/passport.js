// load all the things we need
const BearerStrategy   = require('passport-http-bearer').Strategy;
// load up the user model
const User = require('../models/user');
const Client = require('../models/client');
const _ = require('lodash');

// expose this function to our app using module.exports
module.exports = function (passport) {
    "use strict";
    passport.use(new BearerStrategy(
        function( token, done) {
            User.findByToken(token)
            .then(function(data){
                    let sessVars = data.token.filter(d => d.token === token);
                    if (sessVars && sessVars.enabled && sessVars.client){
                        return {data: data, client: Client.findById(sessVars.client)}
                    }else{
                        return done(null, false);
                    }
            })
            .then(function(data) {
                return done(null, data.data, { scope: data.client.alias });
            })
            .catch(function(err){
                    return done(err);
            });
        }
    ));
};

