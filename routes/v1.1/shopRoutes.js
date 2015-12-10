var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var shopController =  require('../../controllers/shopController')();

    /* GET list shop. */
    /**
     * @api {get} /api/v1.1/shops listar lojas
     * @apiVersion 1.1.0
     * @apiName showViewShop
     * @apiGroup Shops
     *
     * @apiSuccess {Object[]} shop         Lista de lojas.
     * @apiSuccess {String}   shop._id     Id da loja.
     * @apiSuccess {String}   shop.lomadee Lomadee da loja.
     * @apiSuccess {String}   shop.nome    Nome da loja.
     * @apiSuccess {String}   shop.imagem  Imagem da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "560f144544ce1203136dfb05",
     *         "lomadee": true,
     *         "nome": "Submarino",
     *         "imagem": "..."
     *       }
     *     ]
     */
    app.get('/api/v1.1/shops',autentica(passport), shopController.showViewShop);

    /* GET one shop. */
    /**
     * @api {get} /api/v1.1/shops/:id obter loja
     * @apiVersion 1.1.0
     * @apiName obtemShop
     * @apiGroup Shops
     *
     * @apiParam {Object} param    Objeto com os dados da loja.
     * @apiParam {String} param.id Id da loja.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "560f144544ce1203136dfb05"
     *      }
     *
     * @apiSuccess {Object}  loja         Dados da loja.
     * @apiSuccess {String}  loja._id     Id da loja.
     * @apiSuccess {Boolean} loja.lomadee Lomadee da loja.
     * @apiSuccess {String}  loja.nome    Nome da loja.
     * @apiSuccess {String}  loja.imagem  Imagem da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "560f144544ce1203136dfb05",
     *       "lomadee": true,
     *       "nome": "Submarino",
     *       "imagem": "..."
     *     }
     */
    app.get('/api/v1.1/shops/:id',autentica(passport), shopController.obtemShop);

    /* POST create shop. */
    /**
     * @api {post} /api/v1.1/shops criar loja
     * @apiVersion 1.1.0
     * @apiName salvaShop
     * @apiGroup Shops
     *
     * @apiParam {Object}  param         Objeto com os dados da loja.
     * @apiParam {String}  param.id      Id da loja.
     * @apiParam {Boolean} param.lomadee Lomadee da loja.
     * @apiParam {String}  param.nome    Nome da loja.
     * @apiParam {String}  param.imagem  Imagem da loja.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "_id": "560f144544ce1203136dfb05",
     *       "lomadee": true,
     *       "nome": "Submarino",
     *       "imagem": "..."
     *     }
     *
     * @apiSuccess {Object}  loja         Dados da loja.
     * @apiSuccess {String}  loja._id     Id da loja.
     * @apiSuccess {Boolean} loja.lomadee Lomadee da loja.
     * @apiSuccess {String}  loja.nome    Nome da loja.
     * @apiSuccess {String}  loja.imagem  Imagem da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "560f144544ce1203136dfb05",
     *       "lomadee": true,
     *       "nome": "Submarino",
     *       "imagem": "..."
     *     }
     */
    app.post('/api/v1.1/shops',autentica(passport), shopController.salvaShop);

    /* POST delete shop. */
    /**
     * @api {delete} /api/v1.1/shops/:id remover loja
     * @apiVersion 1.1.0
     * @apiName removeShop
     * @apiGroup Shops
     *
     * @apiParam {String} id Id da loja.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1.1/shops/:id',autentica(passport), shopController.removeShop);



    return app;

};