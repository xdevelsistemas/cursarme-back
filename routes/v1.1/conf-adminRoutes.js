var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var confController =  require('../../controllers/conf-adminController')();

    /* GET list conf-admin. */
    app.get('/api/v1.1/conf-admin',autentica(passport), confController.showViewConf);

    /* GET one conf. */
    app.get('/api/v1.1/conf-admin/:id',autentica(passport), confController.obteconfAdmin);

    /* POST create conf-admin. */
    app.post('/api/v1.1/conf-admin',autentica(passport), confController.salvaConf);

    /* POST delete conf-admin. */
    app.delete('/api/v1.1/conf-admin/:id',autentica(passport), confController.removeConf);

    return app;

};