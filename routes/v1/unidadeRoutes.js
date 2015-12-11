var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var unidadeController =  require('../../controllers/unidadeController')();
    /**
     * Obtém todas as unidades
     */
    app.get('/api/v1/unidades', unidadeController.all);

    return app;
};