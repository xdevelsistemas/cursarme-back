var collectionName = 'conf-admin';
var Database = require('../models/conf-admin.js');
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var mongooseErr = require('../services/MongooseErr.js');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {
    var controller = {};


    /**
     * visualizar todas as configuracoes
     * @param req
     * @param res
     * @returns {*}
     */
    controller.showViewConf = function(req, res) {
        try{
            r.obtem(collectionName,Database)
                .then(function(result){res.json(result);})
                .catch(function(erro) {return mongooseErr.apiGetMongooseErr(erro,res);});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }

    };


    /**
     * obtém o conf Admin definido pela id
     * @param req
     * @param res
     */
    controller.obteconfAdmin = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Registro inválido", res, 400);
        }

        Database.findById(_id,
            function (erro, dado) {
                if (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }

                if (!dado)  return mongooseErr.apiCallErr("Registro não encontrado", res, 404);
                return res.json(dado);
            }
        );
    };


    /**
     * remover registro de configuracao
     * @param req
     * @param res
     */
    controller.removeConf = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Registro inválido", res, 400);
        }

        Database.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, Database);
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    /**
     * crud de configuracao - remover registro
     * @param req
     * @param res
     */
    controller.salvaConf = function(req, res) {
        var _id = req.body._id;



        if (_id) {

            if (!ObjectId.isValid(_id)) {
                return mongooseErr.apiCallErr("Registro inválido", res, 400);
            }


            Database.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (conf) {
                    r.refresh(collectionName, Database);
                    return res.json(conf);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            Database.create(req.body)
                .then(
                function (conf) {
                    r.refresh(collectionName, Database);
                    return res.status(201).json(conf);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        }
    };

    return controller;
};