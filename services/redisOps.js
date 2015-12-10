/**
 * Created by clayton on 04/10/15.
 */
var r = require('../config/redis.js');
var  ttl = (60 * 60 * 24);
var  f_refresh = function (name,Database,filter) {
    return Database.find(filter)
        .then(
        function (data) {
            r.redisClient.setAsync(name, JSON.stringify(data));
            return data;
        },
        function (erro) {
            throw erro;
        }
    )
};

var f_flushall = function () {
    r.redisClient.flushall( function (didSucceed) {
        return didSucceed;
    });
};



var f_obtem = function (name,Database,filter) {
    return r.redisClient.getAsync(name).then(function (result) {
        if (result === null) {
            return f_refresh(name,Database,filter);
        } else {
            return JSON.parse(result);
        }
    });
};

module.exports = {
    refresh : f_refresh,
    obtem : f_obtem,
    flushall : f_flushall
};