
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const unitController = require('../../controllers/unitController')();


    app.get('/api/v1/units',autentica(passport), unitController.all);


    app.get('/api/v1/unit',autentica(passport), unitController.one);


    app.post('/api/v1/addUnit',autentica(passport), unitController.add);


    app.post('/api/v1/updateUnit',autentica(passport), unitController.update);


    app.delete('/api/v1/deleteUnit',autentica(passport), unitController.delete);


    return app;
}

