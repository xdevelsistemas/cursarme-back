/**
 * xdevel sistemas escaláveis - book4you
 * @type {*|exports|module.exports}
 */

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var async = require('async');
var crypto = require('crypto');
var format = require('string-format');
var ses = require('nodemailer-ses-transport');
var nodemailer = require('nodemailer');
var awsConf = require('../config/aws');

/**
 * model Schema
 */

var clickSchema = mongoose.Schema({
    readlist : ObjectId,
    book : ObjectId,
    shopData : clickShopSchema,
    user: ObjectId,
    date: {type:Date,required:true}
});

var clickShopSchema = mongoose.Schema({
    refShop : {type:ObjectId,required:true},
    link: {type:String,required:true}
});


var Click = mongoose.model('click', clickSchema);
var ClickShop = mongoose.model('clickShop', clickShopSchema);

/**
 * funçao de controle de clicks
 * @param res
 * @param idReadList
 * @param idBook
 * @param idUser
 * @param idShop
 * @param link
 */
clickSchema.statics.click = function(res, idReadList , idBook , idUser , idShop , link ) {
    var  obj = {date : new Date()};
    if (idUser){
        obj.user  = idUser;
    }

    if (idBook && idShop && link){
        obj.book  = idBook;
        obj.shopData = new ClickShop ({
            refShop : idShop,
            link: link
        });
    }

    if (idReadList){
        obj.readlist  = idReadList;
    }
    /**
     * callback é o retorno
     */
    new clickSchema(obj).save(function(err){
        if (err){
            return mongooseErr.apiGetMongooseErr(err,res);
        }else{
            return res.next();
        }
    });


};




/**
 * export the model Schema
 * @type {Aggregate|Model|*|{}}
 */
module.exports = [Click,ClickShop];