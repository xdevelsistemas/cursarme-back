var mongoose = require('mongoose');
var mongooseRedisCache = require("../config/mongooseRedisCache");
var mongooseRedisCache = require("../config/mongooseRedisCache");

var PLschema = mongoose.Schema({
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
    let include = (arr,obj) => (arr.indexOf(obj) != -1);

    let testSuffix = (email,suffix) => (suffix.length != 0 && suffix != '*') ? email.match(suffix) : true;

    let testUsers = (email,users) => users.length != 0 ? include(users,email) : true;

    return this.find()
        .then(
        (perms) => (testSuffix(email,perms[0]._doc.suffix) && testUsers(email, perms[0]._doc.users)),
        (erro) => {
            console.error(erro);
            res.status(500).json(erro);
        }
    );
};



module.exports = mongoose.model('PermLogin', PLschema);