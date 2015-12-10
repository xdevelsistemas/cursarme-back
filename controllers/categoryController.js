var collectionName = 'categories';
var CategoryModel = require('../models/category');
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var mongooseErr = require('../services/MongooseErr.js');
var ObjectId = require('mongoose').Types.ObjectId;

module.exports = function() {
    var controller = {};


    /**
     * Visualiza todas as categorias
     * @param req
     * @param res
     * @returns {*}
     */
    controller.showViewCategory = function(req, res) {
        try{
            r.obtem(collectionName,CategoryModel)
                .then(function(result){res.status(200).json(result);})
                .catch(function(erro) {return mongooseErr.apiGetMongooseErr(erro,res);});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }

    };


    /**
     * * obtém a categoria definido pela id
     * @param req
     * @param res
     * @returns {*}
     */
    controller.obtemCategory = function(req, res) {
        try{
            var _id = sanitize(req.params.id);

            if (!ObjectId.isValid(_id)) {
                return mongooseErr.apiCallErr("Categoria inválida", res, 400);
            }

            CategoryModel.findById(_id,
                function (erro, dado) {
                    if (erro) {
                        return mongooseErr.apiGetMongooseErr(erro, res);
                    }

                    if (!dado) return mongooseErr.apiCallErr("Categoria não encontrada",res, 404);
                    return res.status(200).json(dado);
                }
            );
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }

    };


    /**
     * Remove a categoria definido pela id
     * @param req
     * @param res
     */
    controller.removeCategory = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Categoria inválida", res, 400);
        }

        CategoryModel.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, CategoryModel);
                return res.status(200).json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    /**
     * Adiciona uma categoria
     * @param req
     * @param res
     */
    controller.salvaCategory = function(req, res) {
        var _id = sanitize(req.body._id);

        if (_id) {

            if (!ObjectId.isValid(_id) || req.body.nome === undefined || req.body.nome === "") {
                return mongooseErr.apiCallErr("Categoria inválida", res, 400);
            }

            CategoryModel.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (category) {
                    r.refresh(collectionName, CategoryModel);
                    return res.status(200).json(category);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            if (req.body.nome === "") {
                return mongooseErr.apiCallErr("Categoria inválida", res, 400);
            }

            CategoryModel.create(req.body)
                .then(
                function (category) {
                    r.refresh(collectionName, CategoryModel);
                    return res.status(201).json(category);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);

                }
            );
        }
    };

    return controller;
};
