// load all the things we need
var BearerStrategy   = require('passport-http-bearer').Strategy;
// load up the user model
var User = require('../models/user');

// expose this function to our app using module.exports
module.exports = function (passport) {
    passport.use(new BearerStrategy(
        function(token, done) {
            User.findOne({ token: token }, function (err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                return done(null, user, { scope: 'all' });
            });
        }
    ));

};