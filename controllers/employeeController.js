
module.exports = () => {
    "use strict";

    let employeeController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const EmployeeModel = require('../models/multitenant/employee');
    const ValidValues = require("../services/validValues");

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
        // validando os dados
        /*if (!ValidValues.validValues(req.body)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

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
        // validando os dados
        /*if (!ValidValues.validValues(req.body)) {
         return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        return EmployeeModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };



    return employeeController;
};
