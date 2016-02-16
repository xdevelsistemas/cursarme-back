
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const clientController = require('../../controllers/clientController')();


    app.get('/api/v1/clients',autentica(passport), clientController.all);


    app.post('/api/v1/addClient',autentica(passport), clientController.add);


    app.post('/api/v1/updateClient',autentica(passport), clientController.update);


    app.delete('/api/v1/deleteClient',autentica(passport), clientController.delete);


    return app;
}

