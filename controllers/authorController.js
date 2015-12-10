var collectionName = 'authors';
var AuthorModel = require('../models/author.js');
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var mongooseErr = require('../services/MongooseErr.js');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {
    var controller = {};

    /**
     * obtém o autor definido pela id
     * @param req
     * @param res
     */
    controller.obtemAutor = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Autor inválido", res, 400);
        }

        AuthorModel.findById(_id,
            function (erro, dado) {
                if (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }

                if (!dado) return mongooseErr.apiCallErr("Registro não encontrado", res, 404);
                return res.json(dado);
            }
        );
    };


    controller.showViewAuthor = function(req, res) {
        try{
            r.obtem(collectionName,AuthorModel)
                .then(function(result){res.status(200).json(result);})
                .catch(function(erro) {return mongooseErr.apiGetMongooseErr(erro,res);});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }

    };



    controller.removeAutor = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Autor inválido", res, 400);
        }

        AuthorModel.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, AuthorModel);
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    controller.salvaAutor = function(req, res) {

        var _id = req.body._id;



        if (_id) {
            if (!ObjectId.isValid(_id) || req.body.nome === undefined || req.body.nome === "") {
                return mongooseErr.apiCallErr("Autor inválido", res, 400);
            }

            AuthorModel.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (author) {
                    r.refresh(collectionName, AuthorModel);
                    return res.status(200).json(author);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            if (req.body.nome === "" || req.body.nome === undefined) {
                return mongooseErr.apiCallErr("Autor inválido", res, 400);
            }

            AuthorModel.create(req.body)
                .then(
                function (author) {
                    r.refresh(collectionName, AuthorModel);
                    return res.status(201).json(author);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);

                }
            );
        }
    };

    return controller;
};

/*
function getDadosAuthor(req, res) {
    res.json(dadosAuthor);

}
*/