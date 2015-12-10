var collectionName = 'readlists';
var ReadlistModel = require('../models/readlist');
var User = require('../models/user.js');
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var S3Upload = require('../services/S3Upload');
var base64 = require('base64-stream');
var mongooseErr = require("../services/MongooseErr");
var ObjectId = require('mongoose').Types.ObjectId;
var fs = require('fs');
var extend = require("extend");


module.exports = function() {
    var controller = {};


    /**
     * Retorna um boolean se categoriaUsuario está contido em categoriaReadList
     * @param categoriaUsuario
     * @param categoriaReadList
     * @returns {boolean}
     */
    var contido = function (categoriaUsuario,categoriaReadList){
        var xreturn = false;

        if (categoriaUsuario.length === 0){
            return true;
        }else{
            categoriaUsuario.forEach(function(el){
                if (categoriaReadList.filter(function(el2){return el2 === el.toString();}).length > 0){
                    xreturn = true;
                }
            });

            return xreturn;
        }

    };


    /**
     * Obtem todas as readlists
     * @param req
     * @param res
     * @returns {*}
     */
    controller.showViewReadlist = function(req, res) {
        try{
            //obtem somente as readlists visiveis
            r.obtem(collectionName,ReadlistModel,{visivel : true})
                .then(function(result){
                    result
                        .forEach(function(el) {
                        if (!el.icon_url) extend(el, {icon_url: ""});
                    });
                    return res.json(result);
                })
                .catch(function(erro) {return mongooseErr.apiGetMongooseErr(erro,res)});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }

    };


    /**
     * Obtem todas as readlist filtradas pelas categorias do usuário
     * @param req
     * @param res
     * @returns {*}
     */
    controller.showViewReadlistByUser = function(req, res) {
        try{
            var idUser = sanitize(req.params.userid),
                usuario;

            if (!ObjectId.isValid(idUser)) {
                return mongooseErr.apiCallErr("Usuário inválido", res, 400);
            }

            User.filtraUsuario(idUser)
                .then(function (user) {
                    usuario = user;
                    // se a primeira consulta fosse do usuário logado , o filtro nao funciona
                    return r.obtem(collectionName, ReadlistModel,{visivel : true});
                })
                .then(function (result) {
                    //TODO FILTRAR CATEGORIAS DO USUÁRIO COM AS READ LISTS (ATENCAO PARA O NOME, DEVERIA SER O MESMO NOS DOIS SCHEMAS
                    if (!!usuario.categories) {
                        result = result.filter(function (reg) {
                            if (!!reg.categoria) {
                                return contido(usuario.categories, reg.categoria);
                            } else {
                                return true;
                            }
                        });
                        result.forEach(function (el) {
                            if (!el.icon_url) extend(el, {icon_url: ""});
                        });
                        res.json(result);
                    } else {
                        result.forEach(function (el) {
                            if (!el.icon_url) extend(el, {icon_url: ""});
                        });
                        return res.json(result);
                    }
                })
                .catch(function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }
    };


    /**
     * obtém o readlist definido pela id
     * @param req
     * @param res
     */
    controller.obtemReadlist = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Readlist inválida", res, 400);
        }

        ReadlistModel.findById(_id,
            function (erro, dado) {
                if (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }

                if (!dado)  return mongooseErr.apiCallErr("Registro não encontrado", res, 404);
                return !!dado.icon_url ? res.json(dado) : res.json(extend(dado, {icon_url: ""}));
            }
        );
    };


    /**
     * TOdo melhorar busca pelo trand-topics(ainda não filtra pelos mais votados)
     *
     * Obtem a lista com o top N das readlists mais curtidas
     * @param req
     * @param res
     */
    controller.obtemTrendTopics = function(req, res) {
        ReadlistModel.find().limit(10).exec()
            .then(function(readlist) {
                if (!readlist) throw new Error("Erro");

                readlist.forEach(function(el) {
                    if (!el.icon_url) el.icon_url = "";
                });
                return res.json(readlist);
            },
            function(erro) {
                return mongooseErr.apiGetMongooseErr(erro,res,404);
            }
        );
    };

    controller.removeReadlist = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Readlist inválida", res, 400);
        }

        ReadlistModel.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, ReadlistModel);
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    /**
     * Altera os dados da readlist ou cria uma
     * @param req
     * @param res
     */
    controller.salvaReadlist = function(req, res) {
        var _id = sanitize(req.body._id);

        if (_id) {
            if (!ObjectId.isValid(_id) || (req.body.nome !== undefined && req.body.nome === "") ||
            (req.body.categoria !== undefined && req.body.categoria.length === 0)) {
                return mongooseErr.apiCallErr("Readlist, 'nome' e/ou categoria inválida(os)", res, 400);
            }

            ReadlistModel.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (readlist) {
                    r.refresh(collectionName, ReadlistModel, {visivel: true});
                    return res.json(readlist);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            if (req.body.nome === undefined || req.body.nome === "" ||
            req.body.categoria === undefined || req.body.categoria.length === 0) {
                return mongooseErr.apiCallErr("Readlist inválida, insera algo no campo 'nome' e/ou categoria", res, 400);
            }

            ReadlistModel.create(req.body)
                .then(
                function (readlist) {
                    r.refresh(collectionName, ReadlistModel, {visivel: true});
                    return res.status(201).json(readlist);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        }
    };



    //app.post('/file-upload', function(req, res) {
    //    // get the temporary location of the file
    //    var tmp_path = req.files.thumbnail.path;
    //    // set where the file should actually exists - in this case it is in the "images" directory
    //    var target_path = './public/images/' + req.files.thumbnail.name;
    //    // move the file from the temporary location to the intended location
    //    fs.rename(tmp_path, target_path, function(err) {
    //        if (err) throw err;
    //        // delete the temporary file, so that the explicitly set temporary upload dir does not get filled with unwanted files
    //        fs.unlink(tmp_path, function() {
    //            if (err) throw err;
    //            res.send('File uploaded to: ' + target_path + ' - ' + req.files.thumbnail.size + ' bytes');
    //        });
    //    });
    //};

    return controller;
};
