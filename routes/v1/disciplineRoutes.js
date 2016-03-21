
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const disciplineController = require('../../controllers/disciplineController')();


    app.get('/api/v1/discipline',autentica(passport), disciplineController.one);


    app.get('/api/v1/disciplines',autentica(passport), disciplineController.all);


    app.post('/api/v1/addDiscipline',autentica(passport), disciplineController.add);


    app.post('/api/v1/updateDiscipline',autentica(passport), disciplineController.update);


    app.delete('/api/v1/deleteDiscipline',autentica(passport), disciplineController.delete);


    return app;
}

