var AWSConfig = require('../config/aws');
var format = require('string-format');
var AWS = require('aws-sdk');
var pipefy = require('pipefy');
var CombinedStream = require('combined-stream');
AWS.config.update(AWSConfig.s3);
var s3 = new AWS.S3();


// S3 Upload options
var bucket = AWSConfig.s3.bucket;

// Keep safe the original function with proper scope
var putObject = s3.putObject.bind(s3);

// Override the function
s3.putObject = function (opts, cb) {
    if (!opts.Body) {
        return pipefy(mapBody)
    }
    return putObject(opts, cb);

    function mapBody(buffer) {
        opts.Body = buffer;
        putObject(opts, cb)
    }
};


//todo tratar os catchs e fazer callbacks esperando resposta.
function uploadImage(obj){
    try {

        // Upload
        var fileKey = format("{0}.{1}",obj.id,obj.type.split('/')[1]);
        var params = {
            Bucket: bucket,
            Key: fileKey,
            ContentType: obj.type,
            ACL: 'public-read'
        };
        var combinedStream = CombinedStream.create();
        combinedStream.append(obj.image);
        combinedStream.pipe(s3.putObject(params, handler));

        return format("https://s3-{0}.amazonaws.com/{1}/{2}",AWSConfig.s3.region,AWSConfig.s3.bucket,fileKey);

    }catch(erro){
        throw erro
    }
}

//todo meglhorar o handler para retornar callback
function handler(err, data) {
    if (!err) {
        console.log('Uploaded!')
    }else{
        console.log(err)
    }
}



module.exports = {
    uploadImage : uploadImage
};


