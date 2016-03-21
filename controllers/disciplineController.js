
module.exports = () => {
    "use strict";

    let disciplineController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const DisciplineModel = require('../models/multitenant/discipline');
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;


    /**
     * Busca um aluno com o número de matrícula
     * @param req
     * @param res
     */
    disciplineController.one = (req, res) => {
        if ((!req.body._id || !ObjectId.isValid(sanitize(req.body._id))) || !req.body.name || !req.body.value) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return DisciplineModel(getClient(req)).findById(req.body._id)
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err,res));
    };

    /**
     * lista todos os alunos
     * @param req
     * @param res
     */
    disciplineController.all = (req, res) => {
        return DisciplineModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err,res));
    };

    /**
     * Adiciona um aluno
     * @param req
     * @param res
     */
    disciplineController.add = (req, res) => {
        if (!req.body.name || !req.body.value) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return DisciplineModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza um aluno
     * @param req
     * @param res
     */
    disciplineController.update = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id)) || !req.body.name || !req.body.value) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return DisciplineModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Remove um aluno
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    disciplineController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return DisciplineModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };


    return disciplineController;
};
