/**
 * Created by clayton on 21/08/15.
 */
module.exports = () => {
    "use strict";

    let unitController = {};
    const  mongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const UnitModel = require('../models/multitenant/unit');

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unitController.all = (req, res) => {
        UnitModel(getClient(req))._all()
            .then(function(data) {
                res.status(200).json(data);
            },
                (erro) => mongooseErr.apiGetMongooseErr(erro,res)
            );
    };

    /**
     * Adiciona uma unidade
     * @param req
     * @param res
     */
    unitController.add = (req, res) => {
        return UnitModel(getClient(req))._add(req.body.userId, true, 'Test', req, res);
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
