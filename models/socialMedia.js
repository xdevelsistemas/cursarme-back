var mongoose = require('mongoose');
var mongooseRedisCache = require("../config/mongooseRedisCache");
var SMschema = mongoose.Schema({
    clientname: {
        type: String
    },
    config: {
        type: Array
    }
});


// methods ======================
// get social
SMschema.statics.authSocial = function(social) {
    return this.findOne({ 'clientname': social },
        function (err, auth) {
            if(auth){
                return auth;
            }
            if(err){
                console.error(erro);
                res.status(500).json(erro);
            }
        }
    );
};

/**
 * enabling caching
 */
SMschema.set('redisCache', true);



//has social
SMschema.statics.hasSocial = function(social) {
    return this.findOne({ 'clientname': social },
        function (err, auth) {
            if(err){
                return false;
            }else{
                if (auth){
                    return true;
                }
                else{
                    return false;
                }
            }
        }
    );
};



module.exports = mongoose.model('SocialMedia', SMschema);