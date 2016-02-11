
module.exports = callModule;

function callModule (app,passport) {
    "use strict";
    const autentica = require('../../services/bearerAuth');
    /**
     * Obtém todas as unidades
     */

    const employeeController = require('../../controllers/employeeController')();



    app.get('/api/v1/employees',autentica(passport), employeeController.all);


    app.post('/api/v1/addEmployee',autentica(passport), employeeController.add);


    app.post('/api/v1/updateEmployee',autentica(passport), employeeController.update);


    app.post('/api/v1/deleteEmployee',autentica(passport), employeeController.delete);


    return app;
}

