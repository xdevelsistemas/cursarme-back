/**
 * Created by clayton on 21/08/15.
 */
module.exports = function() {
    "use strict";
    const  mongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    var unitController = {};

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unitController.all = function(req, res) {
        const  UnitModel = require('../models/multitenant/unit')(getClient(req));

        UnitModel.find()
            .then(
                function(data) {
                    return res.json(data);
                },
                function(erro) {
                    return mongooseErr.apiGetMongooseErr(erro,res);
                }
            );
    };
    return unitController;
};
