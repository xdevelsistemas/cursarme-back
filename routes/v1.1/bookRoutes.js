var autentica = require('../../services/bearerAuth');

module.exports = function (app, passport) {

    var bookController =  require('../../controllers/bookController')();

    /* GET list book. */
    /**
     * @api {get} /api/v1.1/books Listar Livros.
     * @apiVersion 1.1.0
     * @apiName showViewBook
     * @apiGroup Books
     *
     * @apiSuccess {Object[]} books                Lista de livros.
     * @apiSuccess {String}   books._id            Id do livro.
     * @apiSuccess {String}   books.sinopse        Sinopse do livro.
     * @apiSuccess {String}   books.nome           Nome do livro.
     * @apiSuccess {String}   books.autor          Id do autor do livro.
     * @apiSuccess {String}   books.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  books.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} books.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} books.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   books.link.nome      Nome Da loja.
     * @apiSuccess {String}   books.link.loja      Id da loja.
     * @apiSuccess {String}   books.link.link_loja Link da loja.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "56104e10d0264784b4789617",
     *         "sinopse": "Este livro foi baseado...",
     *         "nome": "O Dia D-A Batalha Culminante",
     *         "autor": "560ffedd4e4df77d92f3f1a0",
     *         "editora": "Bertrand Brasil",
     *         "visivel": true,
     *         "readlist": [
     *              "560301b7b57c5d0b00d9a41c"
     *         ],
     *         "link": [
     *           {
     *             "nome": "Submarino",
     *             "loja": "560f144544ce1203136dfb05",
     *             "link_loja": ""
     *           }
     *         ]
     *       }
     *     ]
     */
    app.get('/api/v1.1/books',autentica(passport), bookController.showViewBook);

    /* GET list book per page. */
    /**
     * @api {get} /api/v1.1/booksPagination Listar Livros paginados.
     * @apiVersion 1.1.0
     * @apiName showViewBookPagination
     * @apiGroup Books
     *
     * @apiSuccess {Object[]} books      Dados de crontrole de paginação da grid.
     * @apiSuccess {String}   books.page Número da página da grid.
     * @apiSuccess {String}   books.size Quantidade de livros por página.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "_id": "56104e10d0264784b4789617",
     *         "sinopse": "Este livro foi baseado...",
     *         "nome": "O Dia D-A Batalha Culminante",
     *         "autor": "560ffedd4e4df77d92f3f1a0",
     *         "editora": "Bertrand Brasil",
     *         "visivel": true,
     *         "readlist": [
     *              "560301b7b57c5d0b00d9a41c"
     *         ],
     *         "link": [
     *           {
     *             "nome": "Submarino",
     *             "loja": "560f144544ce1203136dfb05",
     *             "link_loja": ""
     *           }
     *         ]
     *       }
     *     ]
     */
    app.get('/api/v1.1/booksPagination',autentica(passport), bookController.showViewBookPagination);

    /* GET book total pages. */
    /**
     * @api {get} /api/v1.1/bookTotalPages Busca o total de páginas.
     * @apiVersion 1.1.0
     * @apiName showBookTotalPages
     * @apiGroup Books
     *
     * @apiSuccess {Object[]} books        Dados para se obter a quantidade total de páginas.
     * @apiSuccess {String}   books.filter Testo contendo uma string de pesquisa.
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *         "bookTotalPages": 300
     *     }
     */
    app.get('/api/v1.1/bookTotalPages',autentica(passport), bookController.showBookTotalPages);


    /* GET Sinopses da readlist. */
    /**
     * @api {get} /api/v1.1/sinopses/:readlistId/:userId Obtem as sinopses da readlist passada por parâmentro
     * @apiVersion 1.1.0
     * @apiName obtemSinopsesReadlist
     * @apiGroup Books
     *
     * @apiParam {String} readlistId Id da readlist
     * @apiParam {String} userId Id do usuário
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "readlistId": "560ffe9a4e4df77d92f3f112",
     *       "userId": "560ffe9a4e6546546546546w"
     *      }
     *
     * @apiSuccess {Object}   sinopse                Dados completo do livro.
     * @apiSuccess {String}   sinopse._id            Id do livro.
     * @apiSuccess {String}   sinopse.sinopse        Sinopse do livro.
     * @apiSuccess {String}   sinopse.nome           Nome do livro.
     * @apiSuccess {String}   sinopse.autor          Id do autor do livro.
     * @apiSuccess {String}   sinopse.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  sinopse.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} sinopse.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} sinopse.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   sinopse.link.nome      Nome Da loja.
     * @apiSuccess {String}   sinopse.link.loja      Id da loja.
     * @apiSuccess {String}   sinopse.link.link_loja Link do livro na loja.
     * @apiSuccess {String}   sinopse.link.icon_loja Icon da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *      [
     *        {
     *          "_id": "56104dd8d0264784b47895fc",
     *          "sinopse": "O maior tratado de guerra ...",
     *          "nome": "A Arte da Guerra",
     *          "autor": "560ffed14e4df77d92f3f186",
     *          "editora": "Jardim dos Livros",
     *          "visivel": true,
     *          "readlist": [
     *            "560301b7b57c5d0b00d9a41c"
     *          ],
     *          "link": [
     *            {
     *              "nome": "Submarino",
     *              "loja": "560f144544ce1203136dfb05",
     *              "link_loja": "www.aaa.ccc",
     *              "icon_loja": "www.bbb.ccc"
     *            }
     *          ]
     *        }
     *      ]
     *
     */
    app.get('/api/v1.1/sinopses/:readlistId/:userId',autentica(passport), bookController.obtemSinopses);


    /* GET Sinopses da readlist. */
    /**
     * @api {get} /api/v1.1/sinopses/:readlistId Obtem as sinopses da readlist passada por parâmentro
     * @apiVersion 1.1.0
     * @apiName obtemSinopsesReadlist
     * @apiGroup Books
     *
     * @apiParam {String} readlistId Id da readlist
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "readlistId": "560ffe9a4e4df77d92f3f112"
     *      }
     *
     * @apiSuccess {Object}   sinopse                Dados completo do livro.
     * @apiSuccess {String}   sinopse._id            Id do livro.
     * @apiSuccess {String}   sinopse.sinopse        Sinopse do livro.
     * @apiSuccess {String}   sinopse.nome           Nome do livro.
     * @apiSuccess {String}   sinopse.autor          Id do autor do livro.
     * @apiSuccess {String}   sinopse.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  sinopse.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} sinopse.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} sinopse.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   sinopse.link.nome      Nome Da loja.
     * @apiSuccess {String}   sinopse.link.loja      Id da loja.
     * @apiSuccess {String}   sinopse.link.link_loja Link do livro na loja.
     * @apiSuccess {String}   sinopse.link.icon_loja Icon da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *      [
     *        {
     *          "_id": "56104dd8d0264784b47895fc",
     *          "sinopse": "O maior tratado de guerra ...",
     *          "nome": "A Arte da Guerra",
     *          "autor": "560ffed14e4df77d92f3f186",
     *          "editora": "Jardim dos Livros",
     *          "visivel": true,
     *          "readlist": [
     *            "560301b7b57c5d0b00d9a41c"
     *          ],
     *          "link": [
     *            {
     *              "nome": "Submarino",
     *              "loja": "560f144544ce1203136dfb05",
     *              "link_loja": "www.aaa.ccc",
     *              "icon_loja": "www.bbb.ccc"
     *            }
     *          ]
     *        }
     *      ]
     *
     */
    app.get('/api/v1.1/sinopses/:readlistId',autentica(passport), bookController.obtemSinopses);


    /* GET one book. */
    /**
     * @api {get} /api/v1.1/books/:id Obter livro.
     * @apiVersion 1.1.0
     * @apiName obtemBook
     * @apiGroup Books
     *
     * @apiParam {String} id Id do livro
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "id": "560ffe9a4e4df77d92f3f112"
     *      }
     *
     * @apiSuccess {Object}   book                Dados completo do livro.
     * @apiSuccess {String}   book._id            Id do livro.
     * @apiSuccess {String}   book.sinopse        Sinopse do livro.
     * @apiSuccess {String}   book.nome           Nome do livro.
     * @apiSuccess {String}   book.autor          Id do autor do livro.
     * @apiSuccess {String}   book.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  book.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} book.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} book.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   book.link.nome      Nome Da loja.
     * @apiSuccess {String}   book.link.loja      Id da loja.
     * @apiSuccess {String}   book.link.link_loja Link da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "56104e10d0264784b4789617",
     *       "sinopse": "Este livro foi baseado...",
     *       "nome": "O Dia D-A Batalha Culminante",
     *       "autor": "560ffedd4e4df77d92f3f1a0",
     *       "editora": "Bertrand Brasil",
     *       "visivel": true,
     *       "readlist": [
     *          "560301b7b57c5d0b00d9a41c"
     *       ],
     *       "link": [
     *         {
     *           "nome": "Saraiva",
     *           "loja": "560f1cf344ce1203136dfb0b",
     *           "link_loja": "www.aaa.bbb"
     *         }
     *       ]
     *     }
     */
    app.get('/api/v1.1/books/:id',autentica(passport), bookController.obtemBook);

    /* POST create book. */
    /**
     * @api {post} /api/v1.1/books Cadastrar ou atualizar livro.
     * @apiVersion 1.1.0
     * @apiName salvaBook
     * @apiGroup Books
     *
     * @apiParam {Object}   param                Dados do livro passados pelo body.
     * @apiParam {String}   param._id            Id do livro.
     * @apiParam {String}   param.sinopse        Sinopse do livro.
     * @apiParam {Boolean}  param.visivel        Livro disponível para exibição.
     * @apiParam {String[]} param.readlist       Listagem de readlists que o livro pertence.
     * @apiParam {Object[]} param.link           Listagem das editoras que possuem este livro à venda.
     * @apiParam {String}   param.link.nome      Nome Da loja.
     * @apiParam {String}   param.link.loja      Id da loja.
     * @apiParam {String}   param.link.link_loja Link da loja.
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *       "_id": "56104e10d0264784b4789617",
     *       "sinopse": "Este livro foi baseado...",
     *       "visivel": true,
     *       "readlist": [
     *          "560301b7b57c5d0b00d9a41c"
     *       ],
     *       "link": [
     *         {
     *           "nome": "Saraiva",
     *           "loja": "560f1cf344ce1203136dfb0b",
     *           "link_loja": "www.aaa.bbb"
     *         }
     *       ]
     *     }
     *
     * @apiSuccess {Object}   book                Dados do livro.
     * @apiSuccess {String}   book._id            Id do livro.
     * @apiSuccess {String}   book.sinopse        Sinopse do livro.
     * @apiSuccess {String}   book.nome           Nome do livro.
     * @apiSuccess {String}   book.autor          Id do autor do livro.
     * @apiSuccess {String}   book.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  book.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} book.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} book.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   book.link.nome      Nome Da loja.
     * @apiSuccess {String}   book.link.loja      Id da loja.
     * @apiSuccess {String}   book.link.link_loja Link da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "_id": "56104e10d0264784b4789617",
     *       "sinopse": "Este livro foi baseado...",
     *       "nome": "O Dia D-A Batalha Culminante",
     *       "autor": "560ffedd4e4df77d92f3f1a0",
     *       "editora": "Bertrand Brasil",
     *       "visivel": true,
     *       "readlist": [
     *          "560301b7b57c5d0b00d9a41c"
     *       ],
     *       "link": [
     *         {
     *           "nome": "Saraiva",
     *           "loja": "560f1cf344ce1203136dfb0b",
     *           "link_loja": "www.aaa.bbb"
     *         }
     *       ]
     *     }
     */
    app.post('/api/v1.1/books',autentica(passport), bookController.salvaBook);


    /* POST insert like do book. */
    /**
     * @api {post} /api/v1.1/books/likes Insere o objeto {readlist, book} em like do usuário
     * @apiVersion 1.1.0
     * @apiName insereLikes
     * @apiGroup Books
     *
     * @apiParam {Object} like            Objeto com os dados a serem inseridos em like do usuário
     * @apiParam {String} like.userId     Id do usuário
     * @apiParam {String} like.bookId     Id do livro
     * @apiParam {String} like.readlistId Id da readlist
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *          "userId": "562020752b0799b4a36ff86f",
     *          "readlistId": "560301ceb57c5d0b00d9a41d",
     *          "bookId": "56104d8dd0264784b47895d7"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     */
    app.post('/api/v1.1/books/likes',autentica(passport), bookController.insereDisLikes);

    /* POST insert dislike do book. */
    /**
     * @api {post} /api/v1.1/books/dislikes Insere o objeto {readlist, book} em dislike do usuário
     * @apiVersion 1.1.0
     * @apiName insereDisLikes
     * @apiGroup Books
     *
     * @apiParam {Object} dislike            Objeto com os dados a serem inseridos em dislike do usuário
     * @apiParam {String} dislike.userId     Id do usuário
     * @apiParam {String} dislike.bookId     Id do livro
     * @apiParam {String} dislike.readlistId Id da readlist
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *          "userId": "562020752b0799b4a36ff86f",
     *          "readlistId": "560301ceb57c5d0b00d9a41d",
     *          "bookId": "56104d8dd0264784b47895d7"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *
     */
    app.post('/api/v1.1/books/dislikes',autentica(passport), bookController.insereDisLikes);


    /* POST reseta(remove) os dislikes dos sinopses da readlist. */
    /**
     * @api {post} /api/v1.1/books/resetaDislikes Reseta(Remove) os dislikes dos sinopses da readlist
     * @apiVersion 1.1.0
     * @apiName resetaDislikes
     * @apiGroup Books
     *
     * @apiParam {Object} resetDislikes            Objeto com os dados a serem inseridos em dislike do usuário
     * @apiParam {String} resetDislikes.userId     Id do usuário
     * @apiParam {String} resetDislikes.readlistId Id da readlist
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *          "userId": "562020752b0799b4a36ff86f",
     *          "readlistId": "560301ceb57c5d0b00d9a41d"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.post('/api/v1.1/books/resetaDislikes',autentica(passport), bookController.resetaDislikes);


    /* GET Histórico de likes do usuário */
    /**
     * @api {get} /api/v1.1/books/historicoLikes/:userId Reseta(Remove) os dislikes dos sinopses da readlist
     * @apiVersion 1.1.0
     * @apiName historicoLikes
     * @apiGroup Users
     *
     * @apiParam {String} userId Id do usuário
     *
     * @apiParamExample {json} Request-Example:
     *      {
     *          "userId": "562020752b0799b4a36ff86f"
     *      }
     *
     * @apiSuccess {Object[]} hist                      Dados do histórico de likes do usuário.
     * @apiSuccess {Object}   hist.readlist             Dados da readlist.
     * @apiSuccess {String}   hist.readlist._id         Id da readlist.
     * @apiSuccess {String}   hist.readlist.nome        Nome da readlist.
     * @apiSuccess {String}   hist.readlist.descricao   Descrição da readlist.
     * @apiSuccess {String}   hist.readlist.imagem_url  Link web para a imagem da readlist.
     * @apiSuccess {String[]} hist.readlist.categoria   Listagem das categorias da readlist.
     * @apiSuccess {Object}   hist.books                Listagem dos livros que curtiu em relação às readlists.
     * @apiSuccess {String}   hist.books._id            Id do livro.
     * @apiSuccess {String}   hist.books.sinopse        Sinopse do livro.
     * @apiSuccess {String}   hist.books.nome           Nome do livro.
     * @apiSuccess {String}   hist.books.autor          Id do autor do livro.
     * @apiSuccess {String}   hist.books.editora        Nome da editora do livro.
     * @apiSuccess {Boolean}  hist.books.visivel        Livro disponível para exibição.
     * @apiSuccess {String[]} hist.books.readlist       Listagem de readlists que o livro pertence.
     * @apiSuccess {Object[]} hist.books.link           Listagem das editoras que possuem este livro à venda.
     * @apiSuccess {String}   hist.books.link.nome      Nome Da loja.
     * @apiSuccess {String}   hist.books.link.loja      Id da loja.
     * @apiSuccess {String}   hist.books.link.link_loja Link da loja.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     [
     *       {
     *         "readlist": {
     *           "_id": "560302abb57c5d0b00d9a425",
     *           "nome": "Viajando sem Sair do Lugar",
     *           "descricao": "viagens culturais e fantásticas",
     *           "imagem_url": "http://d2vvp137a0eqi5.cloudfront.net/560302abb57c5d0b00d9a425.jpg",
     *           "categoria": [
     *             "5602ff9eb57c5d0b00d9a411"
     *           ]
     *         },
     *         "books": [
     *           {
     *             "_id": "56104d42d0264784b47895b4",
     *             "sinopse": "Leva os leitores mais uma vez...",
     *             "nome": "O Volume Negro",
     *             "autor": "560ffeaf4e4df77d92f3f140",
     *             "editora": "Suma de Letras",
     *             "visivel": true,
     *             "readlist": [
     *               "560302abb57c5d0b00d9a425"
     *             ],
     *             "link": [{
     *               "nome": "Submarino",
     *               "loja": "560f144544ce1203136dfb05",
     *               "link_loja": "http://www.submarino.com.br/produto/111414417/o-volume-negro"
     *             }]
     *           }
     *         ]
     *       }
     *     ]
     */
    app.get('/api/v1.1/books/historicoLikes/:userId', autentica(passport), bookController.historicoLikes);


    /* DELETE delete book. */
    /**
     * @api {delete} /api/v1.1/books/:id Remover livro de listagem.
     * @apiVersion 1.1.0
     * @apiName removeBook
     * @apiGroup Books
     *
     * @apiParam {String} id     Id do Livro
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.delete('/api/v1.1/books/:id',autentica(passport), bookController.removeBook);



    /* DELETE refresh lomadee links. */
    /**
     * @api {post} /api/v1.1/books/refresh atualiza os links de lomadee de todos os livros
     * @apiVersion 1.1.0
     * @apiName refreshLomadee
     * @apiGroup Books
     *
     *
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     */
    app.post('/api/v1.1/books/refresh',autentica(passport), bookController.refreshLomadee);


    return app;

};