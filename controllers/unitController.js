/**
 * Created by clayton on 21/08/15.
 */
module.exports = () => {
    "use strict";

    let unitController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const UnitModel = require('../models/multitenant/unit');
    const ValidAddress = require("../services/validAddress").validAddress;
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;


    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unitController.all = (req, res) => {
        return UnitModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data)
            })
            .catch((erro) => {
                return MongooseErr.apiGetMongooseErr(erro,res)
            });
    };

    /**
     * lista uma unidade
     * @param req
     * @param res
     */
    unitController.one = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return UnitModel(getClient(req)).findById(req.body._id)
            .then((data) => res.status(200).json(data))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona uma unidade
     * @param req
     * @param res
     */
    unitController.add = (req, res) => {
        if (!req.body.name || !req.body.address || !req.body.cnpj || !req.body.alias || !req.body.phone
        || !req.body.website || !req.body.directorAuthorization || !req.body.secretaryAuthorization
        || !ValidAddress(req.body.address)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // convertendo os ids para ObjectId;
        req.body.director = ObjectId.isValid(req.body.director) ? ObjectId(req.body.director) : req.body.director;
        req.body.secretary = ObjectId.isValid(req.body.secretary) ? ObjectId(req.body.secretary) : req.body.secretary;

        return UnitModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => res.status(201).json(data))
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    /**
     * Atualiza uma unidade
     * @param req
     * @param res
     */
    unitController.update = (req, res) => {
        /* || !req.body.address || !req.body.cnpj || !req.body.alias || !req.body.phone
         || !req.body.website || !req.body.directorAuthorization || !req.body.secretaryAuthorization
         || (req.body.address.length === 0) || !ValidAddress(req.body.address)*/
        if (!ObjectId.isValid(sanitize(req.body._id)) || !req.body.name) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        // convertendo os ids para ObjectId;
        /*req.body.director = ObjectId.isValid(req.body.director) ? ObjectId(req.body.director) : req.body.director;
        req.body.secretary = ObjectId.isValid(req.body.secretary) ? ObjectId(req.body.secretary) : req.body.secretary;*/

        return UnitModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => res.status(200).json(data))
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    /**
     * Remove uma unidade
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    unitController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return UnitModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => res.status(200).json({success : true}))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro, res));
    };


    return unitController;
};
