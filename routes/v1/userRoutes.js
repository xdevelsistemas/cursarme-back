/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */

// load the auth variables from mongo
var autentica = require('../../services/bearerAuth');


module.exports = function (app, passport) {

    var userController = require('../../controllers/userController.js')(passport);

    /* pegar a imagem de perfil  do usuário por email */
    /**
     * @api {get} /api/v1/users/picture/:email Busca a imagem(foto) do usuário.
     * @apiVersion 1.0.0
     * @apiName getPictureUrl
     * @apiGroup Users
     *
     * @apiParam {Object} param       Object com os dados do usuário.
     * @apiParam {String} param.email Email do usuário.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "email": "example@test.co"
     *      }
     *
     * @apiSuccess {Object} user         Object com a imagem de perfil do usuário.
     * @apiSuccess {String} user.picture Imagem de perfil do usuário.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "picture": "https://www.aaa.ccc"
     *     }
     *
     */
    app.route('/api/v1/users/picture/:email').get(autentica(passport), userController.getPictureUrl);


    /* POST token email. */
    /**
     * @api {post} /api/v1/users/signup Envia uma email com os passos para seguir com ocadastro.
     * @apiVersion 1.0.0
     * @apiName sendTokenPasswordEmail
     * @apiGroup Users
     *
     * @apiParam {Object} param          Objeto com os dados do token
     * @apiParam {String} param.Host     Host do frontend.
     * @apiParam {String} param.email    Email do destinatário.
     * @apiParam {String} param.template Template do email que irá ser renderizado.
     * @apiParam {String} param.subject  Assunto da mensagem a ser enviada.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "host": "beta.cursar.me/#/",
     *        "email": "example@test.co",
     *        "template": "template",
     *        "subject": "assunto"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     */
    app.route('/api/v1/users/signup').post(autentica(passport), userController.sendTokenCompleteEmail);


    /**
     * @api {get} /api/v1/users/signup/:token verificar token (pré-cadastro)
     * @apiVersion 1.0.0
     * @apiName verifyTokenSignup
     * @apiGroup Users
     *
     * @apiParam {Object} param      Objeto com os dados do token
     * @apiParam {String} param.token Token de validação de pré-cadastro.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "token": "123123"
     *      }
     *
     * @apiSuccess {Object}   user                            Object com os dados dousuário.
     * @apiSuccess {String}   user._id                        Id do usuário.
     * @apiSuccess {String}   user.token                      Token de permissão do usuário.
     * @apiSuccess {String[]} user.likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} user.dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  user.admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} user.categories                 Lista com id das categorias.
     * @apiSuccess {Object}   user.local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   user.local.name                 Nome completo do usuário.
     * @apiSuccess {String}   user.local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   user.local.email                Email para acessar localmente.
     * @apiSuccess {String}   user.local.password             Senha para acessar localmente.
     * @apiSuccess {String}   user.local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     user.local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   user.local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f94f",
     *      "token": "1234",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.route('/api/v1/users/signup/:token').get(autentica(passport),userController.verifyTokenSignup);


    /* POST token password reset. */
    /**
     * @api {post} /api/v1/users/forgot Envia uma email com os passos para resetar a senha.
     * @apiVersion 1.0.0
     * @apiName sendTokenPasswordEmail
     * @apiGroup Users
     *
     * @apiParam {Object} param          Objeto com os dados do token
     * @apiParam {String} param.Host     Host do frontend.
     * @apiParam {String} param.email    Email do destinatário.
     * @apiParam {String} param.template Template do email que irá ser renderizado.
     * @apiParam {String} param.subject  Assunto da mensagem a ser enviada.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *        "host": "beta.cursar.me/#/",
     *        "email": "example@test.co",
     *        "template": "template",
     *        "subject": "assunto"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     */
    app.route('/api/v1/users/forgot').post(autentica(passport), userController.sendTokenPasswordEmail);


    /**
     * @api {get} /api/v1/api/users/forgot/:token verificar token (resetar senha)
     * @apiVersion 1.0.0
     * @apiName verifyTokenResetPassword
     * @apiGroup Users
     *
     * @apiParam {Object} param      Objeto com os dados do token
     * @apiParam {String} param.token Token de validação para resetar a senha do usuário.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "token": "1927c83baa750ca"
     *      }
     *
     * @apiSuccess {String}   _id                        Id do usuário.
     * @apiSuccess {String}   token                      Token de permissão do usuário.
     * @apiSuccess {String[]} likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} categories                 Lista com id das categorias.
     * @apiSuccess {Object}   local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   local.name                 Nome completo do usuário.
     * @apiSuccess {String}   local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   local.email                Email para acessar localmente.
     * @apiSuccess {String}   local.password             Senha para acessar localmente.
     * @apiSuccess {String}   local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f94f"
     *      "token": "1234",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.route('/api/v1/users/forgot/:token').get(autentica(passport),userController.verifyTokenResetPassword);


    /**
     * @api {post} /api/v1/api/users/forgot/:token token para resetar senha
     * @apiVersion 1.0.0
     * @apiName resetPassword
     * @apiGroup Users
     *
     * @apiParam {Object} param      Objeto com os dados do token
     * @apiParam {String} param.token Token para resetar a senha do usuário.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "token": "1234"
     *      }
     *
     * @apiSuccess {String}   _id                        Id do usuário.
     * @apiSuccess {String}   token                      Token de permissão do usuário.
     * @apiSuccess {String[]} likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} categories                 Lista com id das categorias.
     * @apiSuccess {Object}   local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   local.name                 Nome completo do usuário.
     * @apiSuccess {String}   local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   local.email                Email para acessar localmente.
     * @apiSuccess {String}   local.password             Senha para acessar localmente.
     * @apiSuccess {String}   local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f94f",
     *      "token": "1234",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.route('/api/v1/users/forgot/:token').put(autentica(passport),userController.resetPassword);


    /* GET list users. */
    /**
     * @api {get} /api/v1/users Listar Usuário
     * @apiVersion 1.0.0
     * @apiName showViewUser
     * @apiGroup Users
     *
     * @apiSuccess {Object[]} users                            Lista de usuários.
     * @apiSuccess {String}   users._id                        Id do usuário.
     * @apiSuccess {String}   users.token                      Token de permissão do usuário.
     * @apiSuccess {String[]} users.likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} users.dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  users.admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} users.categories                 Lista com id das categorias.
     * @apiSuccess {Object}   users.google                     Objeto com os dados para ter acesso via conta google.
     * @apiSuccess {String}   users.google.picture             Imagem de usuário do google.
     * @apiSuccess {String}   users.google.email               Email de usuário do google.
     * @apiSuccess {String}   users.google.name                Nome de usuário do google.
     * @apiSuccess {String}   users.google.token               Token de autenticação de usuário do google.
     * @apiSuccess {String}   users.google.id                  Id de usuário do google.
     * @apiSuccess {Object}   users.local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   users.local.name                 Nome completo do usuário.
     * @apiSuccess {String}   users.local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   users.local.email                Email para acessar localmente.
     * @apiSuccess {String}   users.local.password             Senha para acessar localmente.
     * @apiSuccess {String}   users.local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     users.local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   users.local.picture              Imagem  de usuário em autenticação local.
     * @apiSuccess {Object}   users.facebook                   Objeto com os dados para ter acesso via conta google.
     * @apiSuccess {String}   users.facebook.id                Id de usuário do facebook.
     * @apiSuccess {String}   users.facebook.email             Email de usuário do facebook.
     * @apiSuccess {String}   users.facebook.name              Nome de usuário do facebook.
     * @apiSuccess {String}   users.facebook.picture           Imagem  de usuário do facebook.
     * @apiSuccess {String}   users.facebook.gender            sexo  de usuário do facebook.
     * @apiSuccess {String}   users.facebook.birthday          data de nascimento do facebook.
     * @apiSuccess {Object}   users.twitter                    Objeto com os dados para ter acesso via conta google.
     * @apiSuccess {String}   users.twitter.id                 Id de usuário do twitter.
     * @apiSuccess {String}   users.twitter.token              Token de autenticação de usuário do twitter.
     * @apiSuccess {String}   users.twitter.email              Email de usuário do twitter.
     * @apiSuccess {String}   users.twitter.name               Nome de usuário do twitter.
     * @apiSuccess {String}   users.twitter.picture            Imagemin de usuário do twitter.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "5612465f94f",
     *         "token": "1234",
     *         "likes": [],
     *         "dislikes": [],
     *         "admin": false,
     *         "categories": [
     *           "5602ff9eb57c5d0b00d9a411"
     *         ],
     *         "google": {
     *           "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50",
     *           "email": "clayton@xdevel.com.br",
     *           "name": "Clayton Santos da Silva",
     *           "token": "1234",
     *           "id": "1234"
     *         },
     *         "local": {
     *           "name": "",
     *           "username": "",
     *           "email": "",
     *           "password": "",
     *           "resetPasswordToken": "",
     *           "resetPasswordExpires": "99/99/9999",
     *           "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *         },
     *         "facebook": {
     *           "token": "",
     *           "gender": "",
     *           "birthday": "",
     *           "email": "",
     *           "name": "",
     *           "picture": ""
     *         },
     *         "twitter": {
     *           "id": "",
     *           "token": "",
     *           "email": "",
     *           "name": "",
     *           "picture": ""
     *         }
     *       }
     *     ]
     */
    app.get('/api/v1/users',autentica(passport), userController.showViewUser);


    /* POST auth users with local strategy. */
    /**
     * @api {post} /api/v1/users/auth/local gerar autenticacao local
     * @apiVersion 1.0.0
     * @apiName authenticateLocal
     * @apiGroup Users
     *
     * @apiParam {Object} param          Objeto com os dados de autenticação
     * @apiParam {String} param.email    Email do usuário.
     * @apiParam {String} param.password Senha do usuário.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "email": "example@test.co",
     *       "password": "145236"
     *      }
     *
     * @apiSuccess {String}   _id                        Id do usuário.
     * @apiSuccess {String}   token                      Token de permissão do usuário.
     * @apiSuccess {String[]} likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} categories                 Lista com id das categorias.
     * @apiSuccess {Object}   local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   local.name                 Nome completo do usuário.
     * @apiSuccess {String}   local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   local.email                Email para acessar localmente.
     * @apiSuccess {String}   local.password             Senha para acessar localmente.
     * @apiSuccess {String}   local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f94",
     *      "token": "1234",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.post('/api/v1/users/auth/local',autentica(passport), userController.authenticateLocal);


    /* POST auth users with facebook strategy. */
    app.post('/api/v1/users/auth/google',autentica(passport), userController.authenticateGoogle);


    /* POST auth users with facebook strategy. */
    app.post('/api/v1/users/auth/facebook',autentica(passport), userController.authenticateFacebook);


    /* POST atualiza categoria no usuario. */
    /**
     * @api {post} /api/v1/users/insereCategoria Insere o objeto {readlist, book} em like do usuário
     * @apiVersion 1.0.0
     * @apiName atualizaCategoria
     * @apiGroup Users
     *
     * @apiParam {Object}    categories                  Objeto com os dados para inserir em categories do usuário
     * @apiParam {String}    categories.userId           Id do usuário
     * @apiParam {Object[]}  categories.categoria        Lista com as categorias selecionadas
     * @apiParam {String}    categories.categoria.id     Id da categoria
     * @apiParam {String}    categories.categoria.nome   Nome da categoria
     * @apiParam {Boolean}   categories.categoria.active Categoria selecionada
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *          "userId": "562020752b0799b4a36ff86f",
     *          "categories": [
     *              {
     *                  "id": "5602ff9eb57c5d0b00d9a411",
     *                  "nome": "Inicial",
     *                  "active": true
     *              }
     *          ]
     *     }
     *
     * @apiSuccess {String}   _id                        Id do usuário.
     * @apiSuccess {String}   token                      Token de permissão do usuário.
     * @apiSuccess {String[]} likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} categories                 Lista com id das categorias.
     * @apiSuccess {Object}   local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   local.name                 Nome completo do usuário.
     * @apiSuccess {String}   local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   local.email                Email para acessar localmente.
     * @apiSuccess {String}   local.password             Senha para acessar localmente.
     * @apiSuccess {String}   local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f94f",
     *      "token": "1234",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.put('/api/v1/users/atualizaCategoria',autentica(passport), userController.atualizaCategoria);


    /* GET one user. */
    /**
     * @api {get} /api/v1/users/:id obter usuário
     * @apiVersion 1.0.0
     * @apiName obtemUser
     * @apiGroup Users
     *
     * @apiParam {Object} param      Objeto com os dados do usuário.
     * @apiParam {String} param.id Id do usuário.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "12313"
     *      }
     *
     * @apiSuccess {String}   _id                        Id do usuário.
     * @apiSuccess {String}   token                      Token de permissão do usuário.
     * @apiSuccess {String[]} likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} categories                 Lista com id das categorias.
     * @apiSuccess {Object}   local                      Objeto com os dados para acesso localmente.
     * @apiSuccess {String}   local.name                 Nome completo do usuário.
     * @apiSuccess {String}   local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   local.email                Email para acessar localmente.
     * @apiSuccess {String}   local.password             Senha para acessar localmente.
     * @apiSuccess {String}   local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f9",
     *      "token": "xyz",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "resetPasswordToken": "",
     *        "resetPasswordExpires": "99/99/9999",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.get('/api/v1/users/:id',autentica(passport), userController.obtemUser);


    /* POST create user. */
    /**
     * @api {post} /api/v1/users criar usuário (genérico).
     * @apiVersion 1.0.0
     * @apiName obtemUser
     * @apiGroup Users
     *
     * @apiParam {Object}   user                Object com os dados do usuário.
     * @apiParam {String}   user._id            Id do usuário.
     * @apiParam {String}   user.email          Email do usuário.
     * @apiParam {Object}   user.local          Objeto com os dados para ter acesso localmente.
     * @apiParam {String}   user.local.name     Nome completo do usuário.
     * @apiParam {String}   user.local.username Nome de usuário para acessar localmente.
     * @apiParam {String}   user.local.email    Email para acessar localmente.
     * @apiParam {String}   user.local.password Senha para acessar localmente.
     * @apiParam {String}   user.local.picture  Imagem  de usuário em autenticação local.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *      "_id": "5612465f9",
     *      "email": "",
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     *
     * @apiSuccess {Object}   user                            Object com os dados do usuário.
     * @apiSuccess {String}   user._id                        Id do usuário.
     * @apiSuccess {String[]} user.likes                      Lista com ids de sipnoses que o usuário gostou.
     * @apiSuccess {String[]} user.dislikes                   Lista com ids de sipnoses que o usuário não gostou.
     * @apiSuccess {Boolean}  user.admin                      Boolean para saber se é admin.
     * @apiSuccess {String[]} user.categories                 Lista com id das categorias.
     * @apiSuccess {Object}   user.local                      Objeto com os dados para ter acesso localmente.
     * @apiSuccess {String}   user.local.name                 Nome completo do usuário.
     * @apiSuccess {String}   user.local.username             Nome de usuário para acessar localmente.
     * @apiSuccess {String}   user.local.email                Email para acessar localmente.
     * @apiSuccess {String}   user.local.password             Senha para acessar localmente.
     * @apiSuccess {String}   user.local.resetPassWordToken   Token para resetar a senha.
     * @apiSuccess {Date}     user.local.resetPassWordExpires Data de expiração do resetPasswordToken.
     * @apiSuccess {String}   user.local.picture              Imagem  de usuário em autenticação local.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *    {
     *      "_id": "5612465f9",
     *      "email": "",
     *      "likes": [],
     *      "dislikes": [],
     *      "admin": false,
     *      "categories": [
     *        "5602ff9eb57c5d0b00d9a411"
     *      ],
     *      "local": {
     *        "name": "",
     *        "username": "",
     *        "email": "",
     *        "password": "",
     *        "picture": "https://lh4.googleusercontent.com/-VXo4ZIPkq40/AAAAAAAAAAI/AAAAAAAAAh0/qt7VpaZvDLM/photo.jpg?sz=50"
     *      }
     *    }
     */
    app.post('/api/v1/users',autentica(passport), userController.salvaUser);


    /* POST delete user. */
    /**
     * @api {delete} /api/v1/users/:id remover usuário
     * @apiVersion 1.0.0
     * @apiName removeUser
     * @apiGroup Users
     *
     * @apiParam {String} id Id do usuário.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1/users/:id',autentica(passport), userController.removeUser);


    return app;
};