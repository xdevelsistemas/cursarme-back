
module.exports = () => {
    "use strict";

    let supplierController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const SupplierModel = require('../models/multitenant/supplier');
    const ValidValues = require("../services/validValues");

    /**
     * lista todos os fornecedores
     * @param req
     * @param res
     */
    supplierController.all = (req, res) => {
        return SupplierModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err,res));
    };

    /**
     * Adiciona um fornecedor
     * @param req
     * @param res
     */
    supplierController.add = (req, res) => {
        /*if (!ValidValues.validValues(req.body, ["complement"])) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        return SupplierModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza um fornecedor
     * @param req
     * @param res
     */
    supplierController.update = (req, res) => {
        /*if (!ValidValues.validValues(req.body)) {
         return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        return SupplierModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Remove um fornecedor
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    supplierController.delete = (req, res) => {
        return SupplierModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };


    return supplierController;
};
