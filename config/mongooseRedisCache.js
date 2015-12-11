var redisClient = require('redis');
var bluebird = require('bluebird');
var mongooseRedisCache = require("mongoose-redis-cache");
bluebird.promisifyAll(redisClient.RedisClient.prototype);
bluebird.promisifyAll(redisClient.Multi.prototype);
// get enviroment variables
var redis_host = process.env.REDIS_HOST;
var redis_port = process.env.REDIS_PORT;
var redis_db = parseInt(process.env.REDIS_DB,10);
var redis_auth = process.env.REDIS_AUTH;
var mongoose = require('mongoose');

module.exports = redis_auth ?  mongooseRedisCache(mongoose, {
    host: redis_host,
    port: redis_port,
    pass: redis_auth
}) :  mongooseRedisCache(mongoose, {
    host: redis_host,
    port: redis_port
});
