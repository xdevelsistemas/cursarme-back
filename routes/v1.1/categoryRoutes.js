var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var categoryController =  require('../../controllers/categoryController')();

    /* GET list category. */
    /**
     * @api {get} /api/v1.1/categories Lista todas as categorias.
     * @apiVersion 1.1.0
     * @apiName showViewCategory
     * @apiGroup Categories
     *
     * @apiSuccess {Object[]} categories      Lista de categorias.
     * @apiSuccess {String}   categories._id  Id da categoria.
     * @apiSuccess {String}   categories.nome Nome da categoria.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *         {
     *           "_id": "5602ff9eb57c5d0b00d9a411",
     *           "nome": "Inicial",
     *         }
     *     ]
     */
    app.get('/api/v1.1/categories',autentica(passport), categoryController.showViewCategory);

    /* GET a category. */
    /**
     * @api {get} /api/v1.1/categories/:id Busca por uma categoria.
     * @apiVersion 1.1.0
     * @apiName showCategory
     * @apiGroup Categories
     *
     * @apiParam {Object} param      Objeto com o id da categoria.
     * @apiParam {String} param.id   Id da categoria
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "123x123x123x123x123x123x"
     *      }
     *
     * @apiSuccess {Object[]} categories      Lista de categorias.
     * @apiSuccess {String}   categories._id  Id da categoria.
     * @apiSuccess {String}   categories.nome Nome da categoria.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *         {
     *           "_id": "123x123x123x123x123x123x",
     *           "nome": "Nome da Categoria",
     *         }
     *     ]
     */
    app.get('/api/v1.1/categories/:id',autentica(passport), categoryController.obtemCategory);

    /* POST create category. */
    /**
     * @api {post} /api/v1.1/categories Cadastrar ou atualizar categoria
     * @apiVersion 1.1.0
     * @apiName salvaCategory
     * @apiGroup Categories
     *
     * @apiParam {Object} param      Objeto com os dados da categoria.
     * @apiParam {String} param.id   Id da categoria
     * @apiParam {String} param.nome Nome da categoria.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "_id": "5602ff9eb57c5d0b00d9a411",
     *       "nome": "Inicial"
     *      }
     *
     * @apiSuccess {String}   _id  Id da categoria.
     * @apiSuccess {String}   nome Nome da categoria.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "5602ff9eb57c5d0b00d9a411",
     *       "nome": "Inicial",
     *     }
     */
    app.post('/api/v1.1/categories',autentica(passport), categoryController.salvaCategory);

    /* POST delete category. */
    /**
     * @api {delete} /api/v1.1/categories/:id Remover categoria
     * @apiVersion 1.1.0
     * @apiName removeCategory
     * @apiGroup Books
     *
     * @apiParam {String} id   Id da categoria
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1.1/categories/:id',autentica(passport), categoryController.removeCategory);

    return app;
};