
module.exports = callModule;

function callModule (app,passport) {
    "use strict";
    const autentica = require('../../services/bearerAuth');
    /**
     * Obtém todas as unidades
     */

    const unitController = require('../../controllers/unitController')();



    app.get('/api/v1/units',autentica(passport), unitController.all);


    app.post('/api/v1/addUnit',autentica(passport), unitController.add);


    app.post('/api/v1/updateUnit',autentica(passport), unitController.update);


    app.delete('/api/v1/deleteUnit',autentica(passport), unitController.delete);


    return app;
}

