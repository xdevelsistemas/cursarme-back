
module.exports = callModule;

function callModule (app,passport) {
    "use strict";

    const autentica = require('../../services/bearerAuth');
    const courseController = require('../../controllers/courseController')();


    app.get('/api/v1/courses',autentica(passport), courseController.all);


    app.get('/api/v1/course',autentica(passport), courseController.one);


    app.post('/api/v1/addCourse',autentica(passport), courseController.add);


    app.post('/api/v1/updateCourse',autentica(passport), courseController.update);


    app.delete('/api/v1/deleteCourse',autentica(passport), courseController.delete);


    return app;
}

