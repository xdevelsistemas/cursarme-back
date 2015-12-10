var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {
    var authorController = require('../../controllers/authorController')();

    /**
     * @api {get} /api/v1.1/authors Listagem de autores
     * @apiVersion 1.1.0
     * @apiName showViewAuthor
     * @apiGroup Authors
     *
     * @apiSuccess {Object[]} authors      Lista de autores.
     * @apiSuccess {String}   authors._id  Id do autor.
     * @apiSuccess {String}   authors.nome Nome do autor.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *         {
     *           "_id": "560ffe9a4e4df77d92f3f112",
     *           "nome": "George R. R. Martin"
     *         }
     *     ]
     */
    app.get('/api/v1.1/authors',autentica(passport), authorController.showViewAuthor);

    /**
     * @api {get} /api/v1.1/authors/:id Busca por um autor
     * @apiVersion 1.1.0
     * @apiName obtemAutor
     * @apiGroup Authors
     *
     * @apiParam {Object} param    Objeto com os dados doautor.
     * @apiParam {String} param.id Id do autor
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "123x123x123x123x123x123x"
     *      }
     *
     * @apiSuccess {Object[]} authors      Dados do autor.
     * @apiSuccess {String}   authors._id  Id do autor.
     * @apiSuccess {String}   authors.nome Nome do autor.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "560ffe9a4e4df77d92f3f112",
     *       "nome": "George R. R. Martin"
     *     }
     */
    app.get('/api/v1.1/authors/:id',autentica(passport), authorController.obtemAutor);

    /**
     * @api {post} /api/v1.1/authors Cadastrar ou atualizar autor
     * @apiVersion 1.1.0
     * @apiName salvaAutor
     * @apiGroup Authors
     *
     * @apiParam {Object} param      Objeto com os dados do autor
     * @apiParam {String} param.nome Nome do autor
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "nome": "George R. R. Martin"
     *      }
     *
     * @apiSuccess {Object} author      Dados atualizados do autor
     * @apiSuccess {String} author._id  Id do autor.
     * @apiSuccess {String} author.nome Nome do autor.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "560ffe9a4e4df77d92f3f112",
     *       "nome": "George R. R. Martin"
     *     }
     */
    app.post('/api/v1.1/authors',autentica(passport), authorController.salvaAutor);

    /**
     * @api {delete} /api/v1.1/authors/:id Remover autor
     * @apiVersion 1.1.0
     * @apiName removeAutor
     * @apiGroup Authors
     *
     * @apiParam {String} id Id do author
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1.1/authors/:id',autentica(passport), authorController.removeAutor);


    return app;

};