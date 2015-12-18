/**
 * Created by clayton on 21/08/15.
 */
module.exports = function() {
    "use strict";
    const  mongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    var unidadeController = {};

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unidadeController.all = function(req, res) {
        const  UnidadeModel = require('../models/multitenant/unidade')(getClient(req));

        UnidadeModel.find()
            .then(
                function(data) {
                    return res.json(data);
                },
                function(erro) {
                    return mongooseErr.apiGetMongooseErr(erro,res);
                }
            );
    };
    return unidadeController;
};
