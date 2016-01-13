/**
 * Created by clayton on 21/08/15.
 */
module.exports = () => {
    "use strict";
    const  mongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    let unitController = {};

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unitController.all = (req, res) => {
        const UnitModel = require('../models/multitenant/unit')(getClient(req));

        UnitModel.all()
            .then(
                (data) => res.status(200).json(data),
                (erro) => mongooseErr.apiGetMongooseErr(erro,res)
            );
    };

    /**
     * Adiciona uma unidade
     * @param req
     * @param res
     */
    unitController.add = (req, res) => {
        const UnitModel = require('../models/multitenant/unit')(getClient(req));

        return UnitModel.add(req.body.userId, true, req, res);
    };

    /**
     * Atualiza uma unidade
     * @param req
     * @param res
     */
    unitController.update = (req, res) => {
        const UnitModel = require('../models/multitenant/unit')(getClient(req));

        return UnitModel.update(req.body.userId, true, req, res);
    };



    return unitController;
};
