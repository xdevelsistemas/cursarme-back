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
        return UnitModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => mongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona uma unidade
     * @param req
     * @param res
     */
    unitController.add = (req, res) => {
        // validando os dados da unidade em req.body
        /*if (!ValidValues.validValues(req.body)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        return UnitModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza uma unidade
     * @param req
     * @param res
     */
    unitController.update = (req, res) => {

        // validando os dados da unidade em req.body
        /*if (!ValidValues.validValues(req.body)) {
         return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        return UnitModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };



    return unitController;
};
