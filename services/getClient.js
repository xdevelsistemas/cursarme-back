module.exports = function (req) {
    if (req.authInfo.scope){
        return req.authInfo.scope;
    }else{
        return null;
    }
};