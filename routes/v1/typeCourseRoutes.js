
module.exports = callModule;

function callModule (app,passport) {
    "use strict";
    const autentica = require('../../services/bearerAuth');
    /**
     * Obtém todas as unidades
     */

    const typeCourseController = require('../../controllers/typeCourseController')();



    app.get('/api/v1/typeCourses',autentica(passport), typeCourseController.all);


    app.get('/api/v1/Typecourse',autentica(passport), typeCourseController.one);


    app.post('/api/v1/addTypeCourse',autentica(passport), typeCourseController.add);


    app.post('/api/v1/updateTypeCourse',autentica(passport), typeCourseController.update);


    app.delete('/api/v1/deleteTypeCourse',autentica(passport), typeCourseController.delete);


    return app;
}

