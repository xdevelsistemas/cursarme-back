var collectionName = 'shops';
var ShopModel = require('../models/shop.js');
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var mongooseErr = require('../services/MongooseErr');
var ObjectId = require('mongoose').Types.ObjectId;


module.exports = function() {
    var controller = {};


    /**
     * busca todos as lojas
     * @param req
     * @param res
     */
    controller.showViewShop = function(req, res) {
        try{
            r.obtem(collectionName,ShopModel)
                .then(function(result){return res.json(result);})
                .catch(function(erro) {return mongooseErr.apiGetMongooseErr(erro,res);});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }
    };


    /**
     * obtem dados de uma loja
     * @param req
     * @param res
     */
    controller.obtemShop = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Loja inválida", res, 400);
        }

        ShopModel.findById(_id).exec()
            .then(
            function (shop) {
                if (!shop) return mongooseErr.apiCallErr("loja não encontrada", res, 404);
                return res.json(shop)
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res, 404);
            }
        );
    };


    /**
     * remove loja
     * @param req
     * @param res
     */
    controller.removeShop = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Registro inválido", res, 400);
        }

        ShopModel.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, ShopModel);
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };

    /**
     * cria ou atualiza loja
     * @param req
     * @param res
     */
    controller.salvaShop = function(req, res) {
        var _id = sanitize(req.body._id);



        if (_id) {

            if (!ObjectId.isValid(_id) || req.body.nome === undefined || req.body.nome === "") {
                return mongooseErr.apiCallErr("Loja inválida", res, 400);
            }

            ShopModel.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (shop) {
                    r.refresh(collectionName, ShopModel);
                    return res.json(shop);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            if (req.body.nome === undefined || req.body.nome === "") {
                return mongooseErr.apiCallErr("Loja inválida", res, 400);
            }

            ShopModel.create(req.body)
                .then(
                function (shop) {
                    r.refresh(collectionName, ShopModel);
                    return res.status(201).json(shop);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);

                }
            );
        }
    };

    return controller;
};