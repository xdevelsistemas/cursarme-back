var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var permLoginController =  require('../../controllers/permLoginController')();
    /**
     * verifica se o usuário especificado pode logar
     */
    app.get('/api/v1/permlogins/:email',autentica(passport), permLoginController.valid);

    return app;

};