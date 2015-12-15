var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {
    "use strict";
    /**
     * Obtém todas as unidades
     */

    const unidadeController = require('../../controllers/unidadeController');



    app.get('/api/v1/unidades',autentica(passport), getUnit.all);

    function getUnit(req, res, next){
        const empresa  = req.headers['empresa'];
        return unidadeController(empresa);
    }

    return app;
};