/**
 * Created by clayton on 21/08/15.
 */
module.exports = () => {
    "use strict";

    let unitController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const UnitModel = require('../models/multitenant/unit');
    const ValidValues = require("../services/validValues");

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unitController.all = (req, res) => {
        return UnitModel(getClient(req))._all()
            .then((data) => {
                return res.status(200).json(data)
            })
            .catch((erro) => mongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona uma unidade
     * @param req
     * @param res
     */
    unitController.add = (req, res) => {
        // validando os dados da unidade em req.body.unit
        /*if (!ValidValues.validValues(req.body.unit)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        let unit = new UnitModel(getClient(req))();

        unit._add(req.body.userId, true, 'Test', req)
            .then((result) => {
                return res.status(201).json(result)
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err, res));
    };

    /**
     * Atualiza uma unidade
     * @param req
     * @param res
     */
    unitController.update = (req, res) => {
        return UnitModel(getClient(req))._update(req.body.userId, true, 'Test', req, res);
    };



    return unitController;
};
