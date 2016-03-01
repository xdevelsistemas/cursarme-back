
module.exports = () => {
    "use strict";

    let studentController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const StudentModel = require('../models/multitenant/student');
    const ValidAddress = require("../services/validAddress");
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;


    /**
     * Busca um aluno com o número de matrícula
     * @param req
     * @param res
     */
    studentController.one = (req, res) => {
        if ((!req.body._id || !ObjectId.isValid(sanitize(req.body._id))) || !req.body.matNumber || !req.body.name) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return StudentModel(getClient(req)).findByMatNumber(req.body)
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
    studentController.all = (req, res) => {
        return StudentModel(getClient(req)).all()
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
    studentController.add = (req, res) => {
        if (!(req.body.matNumber && req.body.name && req.body.birthDate && req.body.cpf && req.body.phones && req.body.user
        && req.body.maritalStatus && req.body.gender && req.body.ethnicity && req.body.contacts && req.body.documents
        && (req.body.address.length === 0) && req.body.address && ValidAddress(req.body.address))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }


        //TOdo criar o user e cadastrar em student junto com os dados do aluno


        return StudentModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
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
    studentController.update = (req, res) => {
        if (!(ObjectId.isValid(sanitize(req.body._id)) && req.body.matNumber && req.body.name && req.body.birthDate
        && req.body.cpf && req.body.phones && req.body.user && req.body.maritalStatus && req.body.gender
        && req.body.ethnicity && req.body.contacts && req.body.documents && (req.body.address.length === 0)
        && req.body.address && ValidAddress(req.body.address))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return StudentModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
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
    studentController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return StudentModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };


    /**
     * Verifica a situação do aluno com a instituição
     * @param cpf
     * @returns {{status: boolean}}
     */
    studentController.verifCpf = (cpf) => {
        return StudentModel(getClient(req)).verifCpf(cpf)
            .then((data) => {
                // TOdo verificar estrutura e campos para os dados de retorno
                return {status: data.status};
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    return studentController;
};
