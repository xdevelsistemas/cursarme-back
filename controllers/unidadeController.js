/**
 * Created by clayton on 21/08/15.
 */
module.exports = function(client) {
    const  mongooseErr = require('../services/MongooseErr');
    const  UnidadeModel = require('../models/multitenant/unidade')(client);
    var unidadeController = {};

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unidadeController.all = function(req, res) {
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
