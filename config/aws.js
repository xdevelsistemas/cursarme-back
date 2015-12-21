/**
 * Created by clayton on 08/10/15.
 */
module.exports = {
    ses :  {
        accessKeyId: process.env.AWS_SES_KEY,
        secretAccessKey: process.env.AWS_SES_SECRET,
        region : process.env.AWS_SES_REGION
    },
    s3 : {
        accessKeyId : process.env.AWS_S3_KEY,
        secretAccessKey : process.env.AWS_S3_SECRET,
        region : process.env.AWS_S3_REGION,
        bucket : process.env.AWS_S3_BUCKET
    }
};