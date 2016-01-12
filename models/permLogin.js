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
    function include(arr,obj) {
        return (arr.indexOf(obj) != -1);
    }

    function testSuffix(email,suffix){
        return (suffix.length != 0 && suffix != '*') ? email.match(suffix) : true
    }

    function testUsers(email,users){
        return users.length != 0 ? include(users,email) : true;
    }

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