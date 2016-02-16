
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const supplierController = require('../../controllers/supplierController')();


    app.get('/api/v1/suppliers',autentica(passport), supplierController.all);


    app.post('/api/v1/addSupplier',autentica(passport), supplierController.add);


    app.post('/api/v1/updateSupplier',autentica(passport), supplierController.update);


    app.delete('/api/v1/deleteSupplier',autentica(passport), supplierController.delete);


    return app;
}

