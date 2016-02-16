
module.exports = () => {
    "use strict";

    let clientController = {};
    const MongooseErr = require('../services/MongooseErr');
    const ClientModel = require('../models/Client');
    const ValidValues = require("../services/validValues");

    /**
     * lista todos os clientes
     * @param req
     * @param res
     */
    clientController.all = (req, res) => {
        return ClientModel.all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err,res));
    };

    /**
     * Adiciona um cliente
     * @param req
     * @param res
     */
    clientController.add = (req, res) => {
        /*if (!ValidValues.validValues(req.body, ["complement"])) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        return ClientModel.add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza um cliente
     * @param req
     * @param res
     */
    clientController.update = (req, res) => {
        /*if (!ValidValues.validValues(req.body)) {
         return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        return ClientModel.update(req.user._id, true, 'Test', req.body)
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
    clientController.delete = (req, res) => {
        return ClientModel.delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };


    return clientController;
};
