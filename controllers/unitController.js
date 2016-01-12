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

        UnitModel.find()
            .then(
                (data) => res.json(data),
                (erro) => mongooseErr.apiGetMongooseErr(erro,res)
            );
    };
    return unitController;
};
