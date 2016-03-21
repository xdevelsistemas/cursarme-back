
module.exports = () => {
    "use strict";

    let typeCourseController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const TypeCourseModel = require('../models/multitenant/typeCourse');
    const ValidValues = require("../services/validValues");
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;

    /**
     * lista um tipo de curso
     * @param req
     * @param res
     */
    typeCourseController.one = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return TypeCourseModel(getClient(req)).findById(req.body._id)
            .then((data) => res.status(200).json(data))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * lista todos os tipos de curso
     * @param req
     * @param res
     */
    typeCourseController.all = (req, res) => {
        return TypeCourseModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona um tipo de curso
     * @param req
     * @param res
     */
    typeCourseController.add = (req, res) => {
        if (!req.body.name || !req.body.unit || !ObjectId.isValid(sanitize(req.body.unit))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return TypeCourseModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza os dados do tipo de curso
     * @param req
     * @param res
     */
    typeCourseController.update = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id)) || !req.body.name || !req.body.unit ||
        !ObjectId.isValid(sanitize(req.body.unit))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return TypeCourseModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    /**
     * Remove um tipo de curso
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    typeCourseController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return TypeCourseModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };



    return typeCourseController;
};
