/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule();



function callModule() {
    "use strict";

    let mongoose = require('mongoose');
    const Schema = mongoose.Schema;
    let extend = require('mongoose-schema-extend');
    const xDevSchema = require("./multitenant/lib/xDevEntity")().xDevSchema;
    const mongooseRedisCache = require("../config/mongooseRedisCache");
    const ObjectId = mongoose.Schema.Types.ObjectId;
    const toObjectId = require('mongoose').Types.ObjectId;
    const bcrypt = require('bcrypt-nodejs');
    const async = require('async');
    const crypto = require('crypto');
    const format = require('string-format');
    const ses = require('nodemailer-ses-transport');
    const nodemailer = require('nodemailer');
    const awsConf = require('../config/aws');
    const MongooseErr = require("../services/MongooseErr");
    const _ = require('lodash');


    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */
    const TokenSchema = new Schema({
        token: { type: String, unique: true , require: true },
        enabled: { type: Boolean , require: true },
        client: { type: Schema.Types.ObjectId, ref : 'Client' , require: true }
    });

    let UserSchema = xDevSchema.extend({
        local: {
            name: String,
            email: String,
            password: String,
            resetPasswordToken: String,
            resetPasswordExpires: Date,
            signupToken: String,
            signupExpires: Date,
            picture: String
        },
        google: {
            id: String,
            token: String,
            email: String,
            name: String,
            picture: String
        },
        facebook: {
            id: String,
            email: String,
            name: String,
            picture: String,
            gender: String,
            birthday: Date
        },
        twitter: {
            id: String,
            token: String,
            email: String,
            name: String,
            picture: String
        },
        token: [TokenSchema],
        email: { type: String, unique: true , require: true },
        cpfcnpj: { type: String, unique: true , require: true }
    });

    /**
     * enabling caching
     */
    UserSchema.set('redisCache', true);


    UserSchema.statics.add = function(userId, useLog, entity, data) {
        let userAdd = this();
        let tokenAdd = [{
            token: UserSchema.generateToken(),
            enabled: true,
            client: client // TOdo amarrar o client
        }];

        userAdd.local = {
            name: data.name,
            email: data.email,
            signupToken: UserSchema.generateToken()
            // TOdo esse token precisa expirar ???
            // signupExpires: data.signupExpires
        };
        userAdd.token = [tokenAdd];
        userAdd.email = data.email;
        userAdd.cpfcnpj = data.cpf;

        return xDevSchema._add(entity, userAdd, userId, useLog, 1, 'Usuário cadastrado');
    };

    /**
     * Atualiza os dados do usuário
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {Promise.<T>|Promise}
     */
    EmployeeSchema.statics.update = function(userId, useLog, entity, data) {
        let EmployeeModel = this;

        return EmployeeModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Unidade atualizada');
            })
    };

    /**
     * static methods
     * generate Hash
     * @param password
     * @returns {*}
     */
    UserSchema.statics.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    /**
     * Gera e retorna um token
     * @returns {*}
     */
    UserSchema.statics.generateToken = () => {
        let token;

        crypto.randomBytes(20, (err, buf) => {
            if (err) throw err;
            token = buf.toString('hex');
        });

        return token;
    };

    /**
     * buscar de usuários pelo email
     * @param email
     * @returns {*|Query}
     */
    UserSchema.statics.findByEmail = function(email) { return this.findOne({ 'email': email })};


    UserSchema.statics.findByToken = function(token) {
        return this.findOne({ token: { $elemMatch: { token : token, enabled:true } } })
    };


    /**
     * filtra usuário pela id
     * @param id
     * @returns {*|Query}
     */
    UserSchema.statics.findById = function(id) { return this.findOne({ '_id': id })};

    /**
     * checa se a senha é valida
     * @param password
     * @returns {*}
     */
    UserSchema.methods.validPassword = (password) => bcrypt.compareSync(password, this.local.password);


    /**
     * envia token por email para o usuário
     * @param mailVars
     * @param field
     * @param res
     * @param next
     */
    UserSchema.statics.sendTokenMail = (mailVars, field, res, next) => {
        // todo verificar o uso de UserModel ao invés do this
        // (escopo em bloco)
        const UserModel = this;

        try {
            let token, error;

            crypto.randomBytes(20, (err, buf) => {
                if (err) throw err;
                token = buf.toString('hex');
            });

            UserModel.findOne({ email: mailVars.email })
                .then((user) => {
                    if (!user) {
                        if (field === 'resetPassword') {
                            error = new Error("O usuário não existe");
                            error.status = 400;
                            throw error;
                        }
                        user =  new UserModel({"email" : mailVars.email});
                        insertToken(user, field, mailVars, token);

                        user.save(function(err){
                            if(err) {
                                throw err;
                            }
                        });
                    } else {
                        if (field === 'signup') {
                            error = new Error("O usuário já existe");
                            error.status = 400;
                            throw error;
                        }

                        if (!!user.google.email || !!user.facebook.email) {
                            error = new Error("O usuário possui rede social");
                            error.status = 400;
                            throw error;
                        }

                        insertToken(user, field, mailVars, token);
                        user.save((err) => {
                            if (!!err) throw err;
                        });
                    }
                    return sendMail(mailVars, token, res);
                })
                .catch((err) =>
                    MongooseErr.apiCallErr(err.message, res, err.status || err.statusCode)
                );

        }
        catch(err) {
            return MongooseErr.apiCallErr(err.message + " - Passou por aqui (sendTokenMail", res, err.status || err.statusCode);
        }
    };



    /**
     * verifica o token e retorna o usuário caso correto para prosseguir com operacao desejada
     * @param token
     * @param field
     * @param res
     */
    UserSchema.statics.verifyToken = (token,field,res) => {
        this.findOne(JSON.parse("{\"local." + field+ "Token\":\"" + token + "\"}"))
            .then((user) => {
                if (!user) {
                    return MongooseErr.apiCallErr("token inválido", res, 401);
                }

                if(user.local[field + "Expires"] &&  new Date(user.local[field + "Expires"]) < Date.now()){
                    return MongooseErr.apiCallErr("token expirado, favor gerar novamente", res, 401);
                }

                return res.status(200).json(user);
            },
            (err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    /**
     * Reseta a senha do usuário
     * @param req
     * @param res
     */
    UserSchema.statics.resetPassword = (req, res) => {
        // todo Verificar o uso de UserModel, ao invés de this
        const UserModel = this;

        UserModel.findOne({"local.resetPasswordToken": req.params.token})
            .then((user) => {
                    if (!user) {
                        return MongooseErr.apiCallErr("token inválido", res, 401);
                    }

                    if (user.local.resetPasswordExpires && new Date(user.local.resetPasswordExpires).getTime() < Date.now()) {
                        return MongooseErr.apiCallErr("token expirado, favor gerar novamente", res, 401);
                    }

                    user.local.resetPasswordExpires = Date.now();
                    user.local.password = UserModel.generateHash(req.body.password);

                    user.save(function (err) {
                        if (!!err) {
                            return MongooseErr.apiGetMongooseErr(err, res);
                        }
                    });

                    return res.status(200).json(user);
                },
                (err) => MongooseErr.apiGetMongooseErr(err, res));
    };


    /**
     * Prepara e envia o email (signup || resetPassword)
     * @param mailVars
     * @param token
     * @param res
     */
    let sendMail = (mailVars, token, res) => {
        let smtpTransport = nodemailer.createTransport(ses({
            accessKeyId: awsConf.ses.accessKeyId,
            secretAccessKey: awsConf.ses.secretAccessKey,

            rateLimit: 5
        }));

        mailVars.token = token;

        let mailOptions = {
            to: mailVars.email,
            from: mailVars.fromEmail,
            subject: mailVars.subjectEmail,
            text: format(mailVars.template,mailVars)
        };

        smtpTransport.sendMail(mailOptions, (err) => {
            if (err) throw err;
            return res.status(200).json({success: true, msg: "Email enviado com sucesso para " + mailVars.email, token: mailVars.token});
        });
    };

    /**
     * Adiciona o novo token e a data de expiração dele.
     * @param user
     * @param field
     * @param mailVars
     * @param token
     */
    let insertToken = (user, field, mailVars, token) => {
        user.local.email = mailVars.email;
        user.local[field + "Token"] = token;
        user.local[field + "Expires"] = Date.now() + (3600000 * 24); // 24 hours
    };

    return mongoose.model('User', UserSchema);
}