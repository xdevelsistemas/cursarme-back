
module.exports = () => {
    "use strict";

    let employeeController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const EmployeeModel = require('../models/multitenant/employee');
    const ValidValues = require("../services/validValues");
    const ValidAddress = require("../services/validAddress").validAddress;
    const sanitize = require('mongo-sanitize');
    const ObjectId = require('mongoose').Types.ObjectId;


    let validPerms = (list) => {
        let isValid = true;

        list.forEach(function(el) {
            isValid = isValid && (!!el.unit && !!el.modules);
        });

        return isValid;
    };

    /**
     * lista um funcionário
     * @param req
     * @param res
     */
    employeeController.one = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return EmployeeModel(getClient(req)).findById(req.body._id)
            .then((data) => res.status(200).json(data))
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * lista todos os funcionários
     * @param req
     * @param res
     */
    employeeController.all = (req, res) => {
        return EmployeeModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona um funcionário
     * @param req
     * @param res
     */
    employeeController.add = (req, res) => {
        if (!req.body.admin || !req.body.enabled || !req.body.position || !req.body.titration || !req.body.perms
        || !validPerms(req.body.perms) || !req.body.name || !req.body.birthDate || !req.body.cpf || !req.body.phones
        || !req.body.user || !req.body.maritalStatus || !req.body.gender || !req.body.ethnicity || !req.body.contacts
        || !req.body.documents || !req.body.address || (req.body.address.length === 0) || !ValidAddress(req.body.address)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        //TOdo criar o user e cadastrar em employee junto com os dados do funcionário

        return EmployeeModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza os dados do funcionário
     * @param req
     * @param res
     */
    employeeController.update = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id)) || !req.body.admin || !req.body.enabled || !req.body.position
        || !req.body.titration || !req.body.perms || !validPerms(req.body.perms) || !req.body.name || !req.body.birthDate
        || !req.body.cpf || !req.body.phones || !req.body.user || !req.body.maritalStatus || !req.body.gender
        || !req.body.ethnicity || !req.body.contacts || !req.body.documents || (req.body.address.length === 0)
        || !req.body.address || !ValidAddress(req.body.address)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return EmployeeModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    /**
     * Remove um funcionário
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    employeeController.delete = (req, res) => {
        if (!ObjectId.isValid(sanitize(req.body._id))) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }

        return EmployeeModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };



    return employeeController;
};
