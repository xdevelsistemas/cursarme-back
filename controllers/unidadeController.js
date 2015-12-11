/**
 * Created by clayton on 21/08/15.
 */
var  mongooseErr = require('../services/MongooseErr');
module.exports = function() {
    var unidadeController = {};

    /**
     * lista todas as unidades
     * @param req
     * @param res
     */
    unidadeController.all = function(req, res) {
        var  UnidadeModel = require('../models/multitenant/unidade')('ieses');
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
