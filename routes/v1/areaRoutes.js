
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const areaController = require('../../controllers/areaController')();


    app.get('/api/v1/areas',autentica(passport), areaController.all);


    app.get('/api/v1/area',autentica(passport), areaController.one);


    app.post('/api/v1/addArea',autentica(passport), areaController.add);


    app.post('/api/v1/updateArea',autentica(passport), areaController.update);


    app.delete('/api/v1/deleteArea',autentica(passport), areaController.delete);


    return app;
}

