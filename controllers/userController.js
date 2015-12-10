/**
 * xdevel sistemas escaláveis - book4you
 * @type {*|exports|module.exports}
 */

var collectionName = 'users';
var UserModel = require('../models/user');
var ObjectId = require('mongoose').Types.ObjectId;
var sanitize = require('mongo-sanitize');
var crypto = require('crypto');
var format = require('string-format');
var extend = require('extend');
var mongooseErr = require('../services/MongooseErr.js');

module.exports = function() {
    var userController = {};


    /**
     * Estratégia local = verifica a senha e retorna o objeto usuário em caso de sucesso
     * @param req
     * @param res
     */
    userController.authenticateLocal = function(req,res) {

        var email = req.body.email;
        var password = req.body.password;

        if ((!email || !(email.indexOf('@') > 0)) || (!password || !(password != ""))) {
            return mongooseErr.apiCallErr("Email e/ou senha inválido(s)", res, 400);
        }

        UserModel.findOne({email: email})
            .then(
            function (user) {
                // verifica  se usuário está cadastrado no sistema
                if (!user) return mongooseErr.apiCallErr("Usuário não encontrado", res, 401);
                // se estiver vazio, é esperado que dê a opcao para mandar email outra vez
                if (!user.local.password) return mongooseErr.apiCallErr("Cadastro de Usuário incompleto", res, 401);
                var validaUsuario = (user.validPassword(password));


                if (!validaUsuario) {
                    return mongooseErr.apiCallErr("Usuário e/ou senha inválidos", res, 401);
                } else {
                    res.status(201).json(user);
                }

            },
            function (err) {
                return mongooseErr.apiGetMongooseErr(err, res)
            }
        );
    };


    /**
     * estratégia facebook = realiza toda a operação de login pelo facebook e retorna o objeto usuário caso de sucesso
     * em caso de necessidade de cadastro, a própria rotina executa corretamente o cadastro
     * @param req
     * @param res
     * @returns {*}
     */
    userController.authenticateFacebook = function(req,res) {
        var facebookId = req.body.facebookId;
        var facebookData = req.body.facebookData;
        var email = facebookData.email;

        if(!email){
            return mongooseErr.apiCallErr("não foi possivel obter o email para cadastro",res,401);
        }


        var facebook = {};

        //colunas obrigatorias do profile
        facebook.id = facebookId;
        facebook.name = facebookData.name;
        facebook.email = facebookData.email;

        if (!!facebookData.gender){
            facebook.gender = facebookData.gender;
        }
        if (!!facebookData.birthday){
            facebook.birthday = new Date(facebookData.birthday);
        }
        if (!!facebookData.picture && !!facebookData.picture.data){
            facebook.picture = "http://graph.facebook.com/" + facebook.id + "/picture?width=160&height=160";
        }
        if (!!facebookData.books && !!facebookData.books.data ){
            facebook.books = facebookData.books.data;
        }
        if (!!facebookData.movies && !!facebookData.movies.data ){
            facebook.movies = facebookData.movies.data;
        }

        UserModel.findByEmail(email)
            .then(
            function(user) {
                if (!user) {
                    // cria o usuário com base nos dados passados
                    user = new UserModel({
                        likes: [],
                        dislikes: [],
                        categories: [],
                        token: "",
                        admin: false,
                        email: email,
                        facebook : facebook
                    });
                }
                else user.facebook = facebook;

                user.save(function(err){
                    if (err){
                        return mongooseErr.apiGetMongooseErr(err,res);
                    }else{
                        return res.json(user);
                    }
                });
            },
            function(erro) {
                return mongooseErr.apiGetMongooseErr(erro,res);
            }
        );
    };


    /**
     * estratégia google = realiza toda a operação de login pelo google e retorna o objeto usuário caso de sucesso
     * em caso de necessidade de cadastro, a própria rotina executa corretamente o cadastro
     * @param req
     * @param res
     * @returns {*}
     */
    userController.authenticateGoogle = function(req,res) {

        //newUser.google.id = profile.id;
        //newUser.google.token = accessToken;
        //newUser.google.name = profile.displayName;
        //newUser.google.email = profile.emails[0].value; // pull the first email
        //newUser.google.picture = picture;

        var email = req.body.google.email;

        if(!email){
            return mongooseErr.apiCallErr("não foi possivel obter o email para cadastro",res,401);
        }


        var google = req.body.google;

        UserModel.findByEmail(email)
            .then(
            function(user) {
                if (!user) {
                    // cria o usuário com base nos dados passados
                    user = new UserModel({
                        likes: [],
                        dislikes: [],
                        categories: [],
                        token: google.token,
                        admin: req.admin,
                        email: google.email,
                        google : google
                    });
                }
                else user.google = google;

                user.save(function(err){
                    if (err){
                        return mongooseErr.apiGetMongooseErr(err,res);
                    }else{
                        return res.json(user);
                    }
                });
            },
            function(erro) {
                return mongooseErr.apiGetMongooseErr(erro,res);
            }
        );
    };


    /**
     * retorna a url da foto do usuário
     * @param req
     * @param res
     * @returns {*}
     */
    userController.getPictureUrl = function (req, res) {
        if (!(req.params.email.indexOf('@') > 0)) {
            return mongooseErr.apiCallErr("Email inválido", res, 400);
        }

        UserModel.findByEmail(req.params.email)
            .then(
            function (user) {
                if (!user) {
                    return mongooseErr.apiCallErr("usuário não encontrado", res, 404);
                } else {
                    if (!!user.google) {
                        return res.json(user.google.picture);
                    } else if (!!user.facebook) {
                        return res.json(user.facebook.picture);
                    } else {

                        if (!!user.local && !!user.local.picture) {
                            return res.json(user.local.picture);
                        } else {
                            //find the gravatar
                            var gravatar_url = format("http://www.gravatar.com/avatar/{0}",
                                crypto.createHash('md5').update(user.email).digest("hex"));
                            return res.json(gravatar_url);
                        }

                    }

                }
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res, 404);
            })
            .catch(function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res, 404);
            }
        );
    };


    /**
     * CRUD usuário = lista os usuários
     * @param req
     * @param res
     */
    userController.showViewUser = function(req, res) {
        UserModel.find()
            .then(
            function(user) {
                return res.json(user);
            },
            function(erro) {
                return mongooseErr.apiGetMongooseErr(erro,res);
            }
        );
    };


    /**
     * CRUD usuário = obtem o usuário como objeto
     * @param req
     * @param res
     */
    userController.obtemUser = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Usuário inválido", res, 400);
        }

        UserModel.findById(_id,
            function (erro, dado) {
                if (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }

                if (!dado) return mongooseErr.apiCallErr("Usuário não encontrado", res, 404);
                return res.json(dado);
            }
        );
    };


    /**
     * CRUD usuário = remove usuário
     * @param req
     * @param res
     */
    userController.removeUser = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Usuário inválido", res, 400);
        }

        UserModel.remove({"_id": _id})
            .then(
            function () {
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    /**
     * CRUD usuário = salva usuário
     * @param req
     * @param res
     */
    userController.salvaUser = function(req, res) {

        if (!!req.body._id) {

            if (!ObjectId.isValid(req.body._id) || (req.body.local.name !== undefined && req.body.local.name === "")) {
                return mongooseErr.apiCallErr("Usuário inválido", res, 400);
            }

            if (!!req.body.local.password) {
                req.body.local.password = UserModel.generateHash(req.body.local.password);
            }

            UserModel.findOne({_id: req.body._id})
                .then(function (user) {
                    var newLocal = user.local;

                    extend(newLocal, req.body.local);

                    user.local = newLocal;

                    user.save(function(err) {
                        if (err) {
                            return mongooseErr.apiGetMongooseErr(err, res);
                        }
                        return res.status(200).json(user);
                    });
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                });
        } else {
            if (!(req.body.email.indexOf('@') > 0)) {
                return mongooseErr.apiCallErr("Email inválido", res, 400);
            }

            UserModel.findByEmail(req.body.email)
                .then(function (user) {
                    if (!user) {
                        return mongooseErr.apiCallErr("Não há usuário cadastrado para este email", res, 401);
                    } else if (!user.local.name && !!user.local.email) {
                        if (!!req.body.local.email && !!req.body.local.name && !!req.body.local.password) {
                            var newUser = req.body;

                            newUser.local.password = UserModel.generateHash(newUser.local.password);
                            newUser.local.signupExpires = Date.now();
                            extend(true, user, newUser);

                            user.save(function (err) {
                                if (!!err) {
                                    return mongooseErr.apiGetMongooseErr(err, res);
                                }
                                return res.status(201).json({
                                    success: true,
                                    msg: "Usuário cadastrado com sucesso",
                                    data: user
                                });
                            });
                        } else return mongooseErr.apiCallErr("Dados inválidos", res, 400);
                    } else if (!user.local.email) {
                        return res.status(401).json({
                            err: "O usuário já possui cadastro com rede social",
                            success: false,
                            fields: [],
                            dadosUser: user
                        });
                    }
                }
            );
        }
    };


    /**
     * envia  email para completar cadastro via estratégia local
     * @param req
     * @param res
     * @param next
     */
    userController.sendTokenCompleteEmail = function(req, res, next) {

        /**
         * valores esperados
         * req.body.host  = host do frontend
         * req.body.email = email do destinatário
         * req.body.template = template do email que irá ser renderizado
         * req.body.subject = assunto da mensagem a ser enviada
         **/

        if (!req.body.email || !req.body.host || !req.body.template || !req.body.subject){
            return mongooseErr.apiCallErr("formato de dados inválido",res,400);
        }

        var emailVars = {
            email : req.body.email,
            op : "signup",
            host : req.body.host,
            token: "",
            fromEmail : 'contato@book4you.co',
            subjectEmail : req.body.subject,
            template : req.body.template
        };

        return UserModel.sendTokenEmail(emailVars, "signup", res, next);
    };


    /**
     * envia email para alterar a senha
     * @param req
     * @param res
     * @param next
     */
    userController.sendTokenPasswordEmail = function(req, res, next) {
        /**
         * valores esperados
         * req.body.host  = host do frontend
         * req.body.email = email do destinatário
         * req.body.template = template do email que irá ser renderizado
         * req.body.subject = assunto da mensagem a ser enviada
         **/

        if (!req.body.email || !req.body.host || !req.body.template || !req.body.subject){
            return mongooseErr.apiCallErr("formato de dados inválido",res,400);
        }

        var emailVars = {
                email : req.body.email,
                op : "reset",
                host : req.body.host,
                token: "",
                fromEmail : 'contato@book4you.co',
                subjectEmail : req.body.subject,
                template : req.body.template
            };

        return UserModel.sendTokenEmail(emailVars,"resetPassword", res, next);
    };


    /**
     * funçao genérica de verificacao de token pelo lado do controller
     * @param op
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    var verifyToken = function (op, req,res,next){
        /**
         * valores esperados
         * req.params.token  = token de cadastro
         **/

        if (!req.params.token){
            return mongooseErr.apiCallErr("formato de dados inválido",res,400);
        }

        return UserModel.verifyToken(req.params.token,op,res)
    };


    /**
     * verifica token no pré-cadastro para completar
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    userController.verifyTokenSignup = function (req, res, next){
        return verifyToken("signup",req,res,next);
    };


    /**
     * verifica token para resetar a senha
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    userController.verifyTokenResetPassword = function (req, res, next){
        return verifyToken("resetPassword",req,res,next);
    };


    /**
     * reseta a senha do usuário
     * @param req
     * @param res
     * @param next
     * @returns {*}
     */
    userController.resetPassword = function (req, res, next){
        /**
         * valores esperados
         * req.params.token  = token de cadastro
         **/

        if (!req.params.token){
            return mongooseErr.apiCallErr("formato de dados inválido",res,400);
        }

        return UserModel.resetPassword(req, res)
    };


    /**
     * Insere a readlist em categoria do usuário
     * @param req
     * @param res
     */
    userController.atualizaCategoria = function(req, res) {
        /**
         * Dados esperados
         * @type {userId: String, categorias: Object[]}
         */
        var body = {
            userId: sanitize(req.body.userId),
            categories: req.body.categories
        };

        if (!ObjectId.isValid(body.userId) || verificaCategorias(body.categories)) {
            return mongooseErr.apiCallErr("Registro inválido", res, 400);
        }

        return UserModel.atualizaCategoria(body, res);
    };

    function verificaCategorias(list) {
        var isNotValid = false;

        list.forEach(function(el) {
            isNotValid = isNotValid || !ObjectId.isValid(el.id);
        });

        return isNotValid;
    }


    return userController;
};
