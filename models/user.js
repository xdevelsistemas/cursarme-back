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
    const xDevSchema = require("lib/xDevEntity").xDevSchema;
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
        client: { type: String , require: true }
    });

    let UserSchema = new Schema({
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


    /**
     * static methods
     * generate Hash
     * @param password
     * @returns {*}
     */
    UserSchema.statics.generateHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);

    /**
     * buscar de usuários pelo email
     * @param email
     * @returns {*|Query}
     */
    UserSchema.statics.findByEmail = (email) => this.findOne({ 'email': email });


    UserSchema.statics.findByToken = (token) => this.findOne({ token: { $elemMatch: { token : token } } });


    /**
     * filtra usuário pela id
     * @param id
     * @returns {*|Query}
     */
    UserSchema.statics.findById = (id) => this.findOne({ '_id': id });

    /**
     * checa se a senha é valida
     * @param password
     * @returns {*}
     */
    UserSchema.methods.validPassword = (password) => bcrypt.compareSync(password, this.local.password);


    /**
     * envia token por email para o usuário
     * @param emailVars
     * @param field
     * @param res
     * @param next
     */
    UserSchema.statics.sendTokenEmail = (emailVars, field, res, next) => {
        // todo verificar o uso de UserModel ao invés do this
        // (escopo em bloco)
        const UserModel = this;

        try {
            let token, error;

            crypto.randomBytes(20, (err, buf) => {
                if (err) throw err;
                token = buf.toString('hex');
            });

            UserModel.findOne({ email: emailVars.email })
                .then((user) => {
                    if (!user) {
                        if (field === 'resetPassword') {
                            error = new Error("O usuário não existe");
                            error.status = 400;
                            throw error;
                        }
                        user =  new UserModel({"email" : emailVars.email});
                        insertToken(user, field, emailVars, token);

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

                        insertToken(user, field, emailVars, token);
                        user.save((err) => {
                            if (!!err) throw err;
                        });
                    }
                    return enviaEmail(emailVars, token, res);
                })
                .catch((err) =>
                    MongooseErr.apiCallErr(err.message, res, err.status || err.statusCode)
                );

        }
        catch(err) {
            return MongooseErr.apiCallErr(err.message + " - Passou por aqui", res, err.status || err.statusCode);
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
     * Insere a categoria em categories do usuário
     * @param Database
     * @param body
     * @param res
     * @returns {*}
     */
    UserSchema.statics.updateCategory = (body, res) => {
        if (!!body.userId) {
            this.findOne({_id: body.userId})
                .then((user) => {
                    // insere novas categorias inexistentes , e remove categorias que foram marcadas para remover e eram existentes
                    user.categories = _.difference(
                        _.union(user.categories.map((el) => el.toString()),_.filter(body.categories,{active: true}).map((el) => el.id)),
                        _.filter(body.categories,{active: false}).map((el) => el.id)).map((el) => toObjectId(el));

                    user.save((err) => {
                        if(!!err) {
                            return MongooseErr.apiGetMongooseErr(err, res)
                        }
                        return res.status(201).send();
                    });
                },
                (erro) => MongooseErr.apiGetMongooseErr(erro, res));
        } else return res.send();
    };




    /**
     * Prepara e envia o email (signup || resetPassword)
     * @param emailVars
     * @param token
     * @param res
     */
    let enviaEmail = (emailVars, token, res) => {
        let smtpTransport = nodemailer.createTransport(ses({
            accessKeyId: awsConf.ses.accessKeyId,
            secretAccessKey: awsConf.ses.secretAccessKey,

            rateLimit: 5
        }));

        emailVars.token = token;

        let mailOptions = {
            to: emailVars.email,
            from: emailVars.fromEmail,
            subject: emailVars.subjectEmail,
            text: format(emailVars.template,emailVars)
        };

        smtpTransport.sendMail(mailOptions, (err) => {
            if (err) throw err;
            return res.status(200).json({success: true, msg: "Email enviado com sucesso para " + emailVars.email, token: emailVars.token});
        });
    };

    /**
     * Adiciona o novo token e a data de expiração dele.
     * @param user
     * @param field
     * @param emailVars
     * @param token
     */
    let insertToken = (user, field, emailVars, token) => {
        user.local.email = emailVars.email;
        user.local[field + "Token"] = token;
        user.local[field + "Expires"] = Date.now() + (3600000 * 24); // 24 hours
    };

    return mongoose.model('User', UserSchema);
}