
module.exports = () => {
    "use strict";

    let areaController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const AreaModel = require('../models/multitenant/area');
    const ValidValues = require("../services/validValues");
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;

    /**
     * lista uma area de curso
     * @param req
     * @param res
     */
    areaController.one = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return AreaModel(getClient(req)).findById(req.body._id)
            .then((data) => res.status(200).json(data))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * lista todas as areas
     * @param req
     * @param res
     */
    areaController.all = (req, res) => {
        return AreaModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona uma area
     * @param req
     * @param res
     */
    areaController.add = (req, res) => {
        if (!req.body.name || !req.body.unit || !ObjectId.isValid(sanitize(req.body.unit)) ||
        !req.body.typeCourse || !ObjectId.isValid(sanitize(req.body.typeCourse))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return AreaModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza uma area
     * @param req
     * @param res
     */
    areaController.update = (req, res) => {
        if (!req.body.name || !req.body.unit || !ObjectId.isValid(sanitize(req.body.unit)) || !req.body.typeCourse ||
        !ObjectId.isValid(sanitize(req.body._id)) || !ObjectId.isValid(sanitize(req.body.typeCourse))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return AreaModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    /**
     * Remove uma area
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    areaController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return AreaModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };



    return areaController;
};
