var redisClient = require('redis');
var bluebird = require('bluebird');

bluebird.promisifyAll(redisClient.RedisClient.prototype);
bluebird.promisifyAll(redisClient.Multi.prototype);


// get enviroment variables
var redis_host = process.env.REDIS_HOST;
var redis_port = process.env.REDIS_PORT;
var redis_db = parseInt(process.env.REDIS_DB,10);
var redis_auth = process.env.REDIS_AUTH;


module.exports = {
    host: redis_host,
    port: redis_port,
    db: redis_db,
    ttl: (60000 * 24 * 30),
    redisClient: function() {
        var r = redisClient.createClient(redis_port, redis_host);
        if (redis_auth)
            r.auth(redis_auth);
        return r;
    }() // connect to redis
};