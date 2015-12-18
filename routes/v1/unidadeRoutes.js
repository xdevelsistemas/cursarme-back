
module.exports = callModule;

function callModule (app,passport) {
    "use strict";
    const autentica = require('../../services/bearerAuth');
    /**
     * Obtém todas as unidades
     */

    const unidadeController = require('../../controllers/unidadeController');



    app.get('/api/v1/unidades',autentica(passport), unidadeController().all);


    return app;
}

