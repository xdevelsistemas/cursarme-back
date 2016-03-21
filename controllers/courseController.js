
module.exports = () => {
    "use strict";

    let courseController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const CourseModel = require('../models/multitenant/course');
    const ValidValues = require("../services/validValues");
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;

    /**
     * lista um curso
     * @param req
     * @param res
     */
    courseController.one = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return CourseModel(getClient(req)).findById(req.body._id)
            .then((data) => res.status(200).json(data))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * lista todos os cursos
     * @param req
     * @param res
     */
    courseController.all = (req, res) => {
        return CourseModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona um curso
     * @param req
     * @param res
     */
    courseController.add = (req, res) => {
        if (!req.body.admin || !req.body.enabled || !req.body.position || !req.body.titration || !req.body.perms
        || !validPerms(req.body.perms) || !req.body.name || !req.body.birthDate || !req.body.cpf || !req.body.phones
        || !req.body.user || !req.body.maritalStatus || !req.body.gender || !req.body.ethnicity || !req.body.contacts
        || !req.body.documents || !req.body.address || (req.body.address.length === 0) || !ValidAddress(req.body.address)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }


        !req.body.name ||
        !req.body.license ||
        !req.body.resolution ||
        !req.body.authorization ||
        !req.body.recognition ||
        !req.body.documents ||
        !req.body.quorum ||
        !req.body.typeCourse ||
        !req.body.area ||
        !req.body.period ||
        !req.body.class ||
        !req.body.modality ||
        !req.body.grade ||


        //TOdo criar o user e cadastrar em employee junto com os dados do curso

        return CourseModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza os dados do curso
     * @param req
     * @param res
     */
    courseController.update = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id)) || !req.body.admin || !req.body.enabled || !req.body.position
        || !req.body.titration || !req.body.perms || !validPerms(req.body.perms) || !req.body.name || !req.body.birthDate
        || !req.body.cpf || !req.body.phones || !req.body.user || !req.body.maritalStatus || !req.body.gender
        || !req.body.ethnicity || !req.body.contacts || !req.body.documents || (req.body.address.length === 0)
        || !req.body.address || !ValidAddress(req.body.address)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return CourseModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    /**
     * Remove um curso
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    courseController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return CourseModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };



    return courseController;
};
