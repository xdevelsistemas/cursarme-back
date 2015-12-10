var collectionName = 'books';
var BookModel = require('../models/book');
var UserModel = require('../models/user');
var ShopModel = require('../models/shop');
var ReadlistModel = require('../models/readlist');
var ObjectId = require('mongoose').Types.ObjectId;
var sanitize = require('mongo-sanitize');
var r = require('../services/redisOps');
var mongooseErr = require("../services/MongooseErr");


module.exports = function() {
    var controller = {};


    controller.showViewBook = function(req, res) {
        try {
            r.obtem(collectionName, BookModel, {visivel: true})
                .then(function (result) {res.json(result);})
                .catch(function (erro) {return mongooseErr.apiGetMongooseErr(erro, res);});
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }
    };


    controller.refreshLomadee = function ( req, res) {

        /**
         * executa a atividade em background , deve ser enviado notificação em caso de sucesso
         */
        BookModel.refreshLomadee();
        res.json({});
    };


    controller.showViewBookPagination = function(req, res) {
        try {
            if (!!req.query.page && !!req.query.size) {
                if (parseInt(req.query.page) === 0 || parseInt(req.query.size) === 0) {
                    return mongooseErr.apiCallErr("Número de pagina e/ou quantidade de registros inválido(s)", res, 400);
                }

                var filter = new RegExp("(" + req.query.filter + ")", "i"),
                    page = parseInt(req.query.page),
                    size = parseInt(req.query.size),
                    skip = page > 0 ? ((page - 1) * size) : 0;
                var filtro = {$or: [{nome: filter}, {editora: filter}]};

                BookModel.find(filtro).skip(skip).limit(size)
                    .then(function (result) {res.status(200).json(result);})
                    .catch(function (erro) { return mongooseErr.apiGetMongooseErr(erro, res); });
            } else {
                return mongooseErr.apiCallErr("Número de pagina e/ou quantidade de registros inválido(s)", res, 400);
            }
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }
    };

    controller.showBookTotalPages = function(req, res) {
        try {
            var filter = new RegExp("(" + req.query.filter + ")", "i"),
                size = req.query.size,
                filtro = {$or: [{nome: filter}, {editora: filter}]};

            BookModel.find(filtro).count()
                .then(function (result) {
                    res.status(200).json({"bookTotalPages": Math.ceil(result/size)});
                })
                .catch(function (erro) { return mongooseErr.apiGetMongooseErr(erro, res); });
        }catch(erro){
            return mongooseErr.apiGetMongooseErr(erro,res);
        }
    };


    /**
     * obtém o livro definido pela id
     * @param req
     * @param res
     */
    controller.obtemBook = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Livro inválido", res, 400);
        }

        BookModel.findById(_id,
            function (erro, dado) {
                if (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }

                if (!dado) return mongooseErr.apiCallErr("Livro não encontrado",res, 404);
                return res.json(dado);
            }
        );
    };


    /**
     * obter os livros de uma readlist
     * @param req
     * @param res
     */
    controller.obtemSinopses = function(req, res) {
        /**
         * Dados espereados via parâmentro
         * @type {{readlistId: *, userId: *}}
         */
        if (!req.params.readlistId || !ObjectId.isValid(req.params.readlistId)  ){
            return mongooseErr.apiCallErr("formato inválido", res, 400);
        }

        var params = {
            strReadlistId: sanitize(req.params.readlistId),
            strShop: "shops"
        };

        //userId é opcional
        if(!!req.params.userId){

            if (!ObjectId.isValid(req.params.userId)) {
                return mongooseErr.apiCallErr("usuário inválido", res, 400);
            }
            
            params.userId = req.params.userId
        }

        
        return BookModel.filterSinopsesReadlist(UserModel, ReadlistModel, ShopModel, params, r, res);
    };


    /**
     * Insere o objeto (readlist, book) em likes/dislikes
     * @param req
     * @param res
     */
    controller.insereDisLikes = function(req, res) {
        /**
         * Dados esperados
         * @type {{userId: *, readlist: *, book: *}}
         */
        if (!req.body.userId || !req.body.readlistId || !req.body.bookId ){
            return mongooseErr.apiCallErr("formato inválido", res, 400);
        }

        var body = {
            userId: sanitize(req.body.userId),
            readlistId: ObjectId(sanitize(req.body.readlistId)),
            bookId: ObjectId(sanitize(req.body.bookId))
        };

        // TOdo remover do dislikes se tiver
        if (!ObjectId.isValid(body.userId) && !ObjectId.isValid(body.readlistId) && !ObjectId.isValid(body.bookId)) {
            return mongooseErr.apiCallErr("Usuário, readlist e/ou livro inválido(s)", res, 400);
        }

        return BookModel.insereDisLikes(UserModel, body, req.url.match(/([^/]+)[^/]*$/g).toString(), res);
    };


    /**
     * Retira de dislikes as sinopses da readlist
     * @param req
     * @param res
     */
    controller.resetaDislikes = function(req, res) {
        /**
         * Dados esperados
         * @type {{userId: *, readlistId: *}}
         */
        if (!req.body.userId || !req.body.readlistId ){
            return mongooseErr.apiCallErr("formato inválido", res, 400);
        }

        if (!ObjectId.isValid(req.body.userId) || !ObjectId.isValid(req.body.readlistId)) {
            return mongooseErr.apiCallErr("Usuário e/ou readlist inválido(s)", res, 400);
        }

        var body = {
            userId: sanitize(req.body.userId),
            readlistId: ObjectId(sanitize(req.body.readlistId))
        };

        return BookModel.resetaDislikes(UserModel, body, res);
    };


    /**
     * remover livro
     * @param req
     * @param res
     */
    controller.removeBook = function(req, res) {
        var _id = sanitize(req.params.id);

        if (!ObjectId.isValid(_id)) {
            return mongooseErr.apiCallErr("Livro inválido", res, 400);
        }

        BookModel.remove({"_id": _id}).exec()
            .then(
            function () {
                r.refresh(collectionName, BookModel);
                return res.json({success : true});
            },
            function (erro) {
                return mongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    };


    /**
     * salvar livro
     * @param req
     * @param res
     */
    controller.salvaBook = function(req, res) {
        var _id = sanitize(req.body._id);



        if (_id) {

            if (!ObjectId.isValid(_id) || (req.body.nome !== undefined && req.body.nome === "") ||
                (req.body.editora !== undefined && req.body.editora === "") ||
                (req.body.autor !== undefined && req.body.autor === "")) {
                return mongooseErr.apiCallErr("Livro inválido", res, 400);
            }

            BookModel.findByIdAndUpdate(_id, req.body, {new: true}).exec()
                .then(
                function (book) {
                    // realiza refresh em todas as readlists que contém o livro
                    book.readlist.forEach(function (el) {
                        r.refresh(el, BookModel, {
                            visivel: true,
                            readlist: {
                                $exists: true,
                                $not: {$size: 0},
                                $in: [new ObjectId(el)]
                            }
                        })
                    });
                    r.refresh(collectionName, BookModel);
                    return res.json(book);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);
                }
            );
        } else {
            var bookC = req.body,
                readlist = [];

            bookC.readlist.forEach(function(el) {
                typeof el === 'string' ? readlist.push(ObjectId(el)) : readlist.push(el);
            });

            bookC.readlist = readlist;

            BookModel.create(bookC)
                .then(
                function (book) {
                    // realiza refresh em todas as readlists que contém o livro
                    book.readlist.forEach(function (el) {
                        r.refresh(el, BookModel, {
                            visivel: true,
                            readlist: {
                                $exists: true,
                                $not: {$size: 0},
                                $in: [new ObjectId(el)]
                            }
                        })
                    });
                    r.refresh(collectionName, BookModel);
                    return res.status(201).json(book);
                },
                function (erro) {
                    return mongooseErr.apiGetMongooseErr(erro, res);

                }
            );
        }
    };


    /**
     * TOdo criar function para histórico de likes
     */

    /**
     * Busca o histórico de likes do usuário
     * @param req
     * @param res
     */
    controller.historicoLikes = function(req, res) {
        var params = {
            userId: sanitize(req.params.userId)
        };

        if (!ObjectId.isValid(params.userId)) {
            return mongooseErr.apiCallErr("Usuário inválido", res, 400);
        }

        return BookModel.historicoLikes(UserModel, ReadlistModel,ShopModel, params, collectionName, r, res);
    };






    controller.compraLivro = function (req,res){

    };

    return controller;
};