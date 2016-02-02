
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const studentController = require('../../controllers/studentController');


    app.get('/api/v1/students',autentica(passport), studentController().all);


    app.post('/api/v1/addStudent',autentica(passport), studentController().add);


    app.post('/api/v1/updateStudent',autentica(passport), studentController().update);


    return app;
}
