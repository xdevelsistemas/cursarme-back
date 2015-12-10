var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var readlistController =  require('../../controllers/readlistController')();

    /* GET list readlist. */
    /**
     * @api {get} /api/v1.1/readlists Listar readlists (completa).
     * @apiVersion 1.1.0
     * @apiName showViewReadlist
     * @apiGroup Readlists
     *
     * @apiSuccess {Object[]} readlists           Lista de readlists.
     * @apiSuccess {String}   readlists._id       Id da readlist.
     * @apiSuccess {String}   readlists.nome      Nome da readlist.
     * @apiSuccess {String}   readlists.descricao Descrição da readlist.
     * @apiSuccess {String}   readlists.imagem_url  Url da imagem da readlist.
     * @apiSuccess {String[]} readlists.categoria Lista com o id das categorias que a readlist.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "5602ffdeb57c5d0b00d9a412",
     *         "nome": "Eu ja Li esse filme",
     *         "descricao": "livros que viraram filmes",
     *         "imagem": "http://x.y.z/img.png",
     *         "categoria": [
     *           "5602ff9eb57c5d0b00d9a411"
     *         ]
     *       }
     *     ]
     */
    app.get('/api/v1.1/readlists',autentica(passport), readlistController.showViewReadlist);


    /* GET user readlist based on categories were like */
    /**
     * @api {get} /api/v1.1/:userid/readlists Listar readlists categorizadas pelo usuário
     * @apiVersion 1.1.0
     * @apiName showViewReadlistByUser
     * @apiGroup Readlists
     *
     * @apiParam {Object} param      Objeto com os dados do usuário.
     * @apiParam {String} param.id   Id do usuário
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "userId": "5602ff9eb57c5d0b00d9a411"
     *      }
     *
     * @apiSuccess {Object[]} readlists            Lista de readlists.
     * @apiSuccess {String}   readlists._id        Id da readlist.
     * @apiSuccess {String}   readlists.nome       Nome da readlist.
     * @apiSuccess {String}   readlists.descricao  Descrição da readlist.
     * @apiSuccess {String}   readlists.imagem_url Url da imagem da readlist.
     * @apiSuccess {String[]} readlists.categoria  Lista com id das categorias que a readlist.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "5602ffdeb57c5d0b00d9a412",
     *         "nome": "Eu ja Li esse filme",
     *         "descricao": "livros que viraram filmes",
     *         "imagem_url": "http://x.y.z/img.png",
     *         "categoria": [
     *           "5602ff9eb57c5d0b00d9a411"
     *         ]
     *       }
     *     ]
     */
    app.get('/api/v1.1/:userid/readlists',autentica(passport), readlistController.showViewReadlistByUser);

    /* GET one readlist. */
    /**
     * @api {get} /api/v1.1/readlists/:id Obter Readlist
     * @apiVersion 1.1.0
     * @apiName obtemReadlist
     * @apiGroup Readlists
     *
     * @apiParam {Object} param      Objeto com os dados da readlist.
     * @apiParam {String} param.id   Id da readlist
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "5602ff9eb57c5d0b00d9a411"
     *      }
     *
     * @apiSuccess {Object}   readlist           Dados da readlist.
     * @apiSuccess {String}   readlist._id        Id da readlist.
     * @apiSuccess {String}   readlist.nome       Nome da readlist.
     * @apiSuccess {String}   readlist.descricao  Descrição da readlist.
     * @apiSuccess {String}   readlist.imagem_url Url da imagem da readlist.
     * @apiSuccess {String[]} readlist.categoria  Lista com id das categorias que a readlist.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "5602ffdeb57c5d0b00d9a412",
     *       "nome": "Eu ja Li esse filme",
     *       "descricao": "livros que viraram filmes",
     *       "imagem_url": "http://x.y.z/img.png",
     *       "categoria": [
     *         "5602ff9eb57c5d0b00d9a411"
     *       ]
     *     }
     */
    app.get('/api/v1.1/readlists/:id',autentica(passport), readlistController.obtemReadlist);

    /* GET trend-topics das readlists. */
    /**
     * @api {get} /api/v1.1/trend-topics
     * @apiVersion 1.1.0
     * @apiName obtemTrendTopics
     * @apiGroup Readlists
     *
     * @apiSuccess {Object[]} readlists            Listagem das readlist com mais curtidas entre os usuários.
     * @apiSuccess {String}   readlists._id        Id da readlist.
     * @apiSuccess {String}   readlists.nome       Nome da readlist.
     * @apiSuccess {String}   readlists.descricao  Descrição da readlist.
     * @apiSuccess {String}   readlists.imagem_url Url da imagem da readlist.
     * @apiSuccess {String[]} readlists.categoria  Lista com id das categorias que a readlist.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "5602ffdeb57c5d0b00d9a412",
     *         "nome": "Eu ja Li esse filme",
     *         "descricao": "livros que viraram filmes",
     *         "imagem_url": "http://x.y.z/img.png",
     *         "categoria": [
     *           "5602ff9eb57c5d0b00d9a411"
     *         ]
     *       }
     *     ]
     *
     */
    app.get('/api/v1.1/trend-topics',autentica(passport), readlistController.obtemTrendTopics);

    /* POST create readlist. */
    /**
     * @api {post} /api/v1.1/readlist Criar ou atualizar readlist
     * @apiVersion 1.1.0
     * @apiName salvaReadlist
     * @apiGroup Readlists
     *
     * @apiParam {Object}   readlist            Dados da readlist.
     * @apiParam {String}   readlist._id        Id da readlist.
     * @apiParam {String}   readlist.imagem_url Url da imagem da readlist.
     * @apiParam {String[]} readlist.categoria  Lista com id das categorias que a readlist.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "_id": "5602ffdeb57c5d0b00d9a412",
     *       "imagem": "http://x.y.z/img.png",
     *       "categoria": [
     *         "5602ff9eb57c5d0b00d9a411"
     *       ]
     *     }
     *
     * @apiSuccess {String}   _id        Id da readlist.
     * @apiSuccess {String}   nome       Nome da readlist.
     * @apiSuccess {String}   descricao  Descrição da readlist.
     * @apiSuccess {String}   imagem_url Url da imagem da readlist.
     * @apiSuccess {String[]} categoria  Lista com id das categorias que a readlist.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "5602ffdeb57c5d0b00d9a412",
     *       "nome": "Eu ja Li esse filme",
     *       "descricao": "livros que viraram filmes",
     *       "imagem": "http://x.y.z/img.png",
     *       "categoria": [
     *         "5602ff9eb57c5d0b00d9a411"
     *       ]
     *     }
     */
    app.post('/api/v1.1/readlists',autentica(passport), readlistController.salvaReadlist);

    /* POST delete readlist. */
    /**
     * @api {delete} /api/v1.1/readlists/:id Remover readlist
     * @apiVersion 1.1.0
     * @apiName removeReadlist
     * @apiGroup Readlists
     *
     * @apiParam {String}   id        Id da readlist.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1.1/readlists/:id',autentica(passport), readlistController.removeReadlist);

    return app;

};