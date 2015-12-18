// load all the things we need
const BearerStrategy   = require('passport-http-bearer').Strategy;
// load up the user model
const User = require('../models/user');
const _ = require('lodash');

// expose this function to our app using module.exports
module.exports = function (passport) {
    "use strict";
    passport.use(new BearerStrategy(
        function( token, done) {
            User.findByToken(token)
            .then(function(data){
                    let sessVars = _.first(data.token);
                    if (sessVars && sessVars.enabled && sessVars.client){
                        return done(null, data, { scope: sessVars.client });
                    }else{
                        return done(null, false);
                    }
            })
            .catch(function(err){
                    return done(err);
            });
        }
    ));
};

