// models/book.js
var mongoose = require('mongoose');
var rp = require('request-promise');
mongoose.Promise = require('bluebird');
var ObjectId = require('mongoose').Types.ObjectId;
var MongooseErr = require("../services/MongooseErr");
var extend = require("extend");
var ConfAdmin = require('./conf-admin.js');
var Shop = require('./shop.js');
var parseString = require('xml2js').parseString;
var r = require('../services/redisOps');


var bookSchema = mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    autor: {
        type: String,
        required: true
    },
    editora: {
        type: String,
        required: true
    },
    sinopse: {
        type: String,
        required: true
    },
    link: {
        type: Array
    },
    chave_api: {
        type: String
    },
    chave_referencia: {
        type: String
    },
    readlist: {
        type: Array,
        required: true
    },
    visivel: {
        type: Boolean,
        required: true
    }
});

/**
 * Busca as sinopses pertencentes à readlist passado como parâmentro
 * @param id
 * @returns {*}
 */
bookSchema.statics.showSinopsesReadlist = function (id) {
    // TOdo melhorar funcionamento de busca para filtrar as sinopses que ainda não foram curtidas/descurtidas
    return this.find({ readlist: { $exists: true, $not: { $size: 0 }, $in: [ id ] }})
};

/**
 * Insere o objeto {readlist, book} no likes/dislikes do usuário
 * @param UserModel
 * @param body
 * @param operacao
 * @param res
 */
bookSchema.statics.insereDisLikes = function (UserModel, body, operacao, res) {
    if (!!body.userId) {
        UserModel.findOne({_id: body.userId})
            .then(function(user) {
                var filtro = function(el) {
                    return el.readlist.equals(body.readlistId) && el.book.equals(body.bookId)
                };

                if (user[operacao].filter(filtro).length === 0) {
                    user[operacao].push({readlist: body.readlistId, book: body.bookId});

                    user.save(function(err) {
                        if(err) {
                            return MongooseErr.apiGetMongooseErr(err, res)
                        }
                        return res.status(201).send();
                    });
                } else return res.send();
            },
            function(erro) {
                return MongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    } else return res.send();
};

bookSchema.statics.restoreLinks = function (ConfAdminModel) {
    var BookModel = this;
    ConfAdminModel.findOne().then(function(data){
        return BookModel.find( { $or : [ { $ne : {"chave_api" :data.chave_api  } }  , { $ne :  {"chave_referencia" :data.chave_referencia  }} ]});
    }).then(function(books){
        books.forEach(function(element,index,array){

        })
    });
};


bookSchema.statics.resetaDislikes = function (UserModel, body, res) {
    if (!!body.userId) {
        UserModel.findOne({_id: body.userId}).exec()
            .then(function(user) {
                var auxDislikes = [];

                user.dislikes.forEach(function(dislike) {
                    if (!dislike.readlist.equals(body.readlistId)) {
                       auxDislikes.push(dislike);
                    }
                });

                user.dislikes = auxDislikes;

                user.save(function(err) {
                    if(err) {
                        return MongooseErr.apiGetMongooseErr(err, res)
                    }
                    return res.status(201).send();
                });
            },
            function(erro) {
                return MongooseErr.apiGetMongooseErr(erro, res);
            }
        );
    } else return res.send();
};

bookSchema.statics.filterSinopsesReadlist = function(UserModel, ReadlistModel, ShopModel, params, r, res) {
    var BookModel = this;
    try{
        var _id = ObjectId(params.strReadlistId),
            filtroSinopses = {readlist: {$exists: true, $not: {$size: 0}, $in: [_id]}};


        //todo o if-else usa codigo repetidos que podem ser encapsulados
        var sinopses = [];
        if (!!params.userId) {
            var likes = [], dislikes = [];

            params.userId = ObjectId(params.userId);

            UserModel.findOne({_id: params.userId})
                .then(function(user) {
                    likes = user.likes.filter(function (el) {
                        return el.readlist.equals(_id)
                    }).map(function (el) {
                        return el.book
                    });
                    dislikes = user.dislikes.filter(function (el) {
                        return el.readlist.equals(_id)
                    }).map(function (el) {
                        return el.book
                    });
                    return r.obtem(params.strReadlistId, BookModel, filtroSinopses)
                })
                .then(function(result){
                    result.forEach(function(el) {
                        if (filterDisLikes(likes, el._id).length === 0 && filterDisLikes(dislikes, el._id).length === 0) {sinopses.push(el);}
                    });

                    return r.obtem(params.strShop, ShopModel)
                })
                .then(function(result){
                    sinopses.forEach(function(el) {
                        el.link.forEach(function(elem) {
                            elem.icon_loja = getLoja(result, elem.loja)[0].icon_url;
                        });
                    });

                    return res.status(200).json(sinopses);
                })
                .catch(function(erro) {
                    return MongooseErr.apiGetMongooseErr(erro,res)
                }
            );
        } else {
            r.obtem("readlists", ReadlistModel)
                .then(function(result) {
                    var read;

                    read = result.filter(function(el) { return _id.toString() === el._id.toString() });

                    return !read[0].publico ?
                        res.status(401).json({"err": "Readlist bloqueada para usuários não logados", "fields": []}) :
                        r.obtem(params.strReadlistId, BookModel, filtroSinopses);
                })
                .then(function(result){
                    //todo revisar o uso de variavel em chain promises, isso pode ter side-effects por quebra de paradigma funcional
                    sinopses = result;
                    return r.obtem(params.strShop, ShopModel)
                })
                .then(function(result){
                    sinopses.forEach(function(el) {
                        el.link.forEach(function(elem) {
                            elem.icon_loja = getLoja(result, elem.loja)[0].icon_url;
                        });
                    });

                    return res.status(200).json(sinopses);
                })
                .catch(function(erro) {
                    return MongooseErr.apiGetMongooseErr(erro,res)
                }
            );
        }
    }catch(erro){
        return MongooseErr.apiGetMongooseErr(erro,res);
    }
};

/**
 * Filtra em likes/dislikes se existe item
 * @param list
 * @param item
 * @returns {*}
 */
function filterDisLikes(list, item) {
    return list.filter(function(element) {
        return element.toString() === item;
    });
}

/**
 * Busca a loja com base no item( id que está em link do livro)
 * @param list
 * @param item
 * @returns {*}
 */
function getLoja(list, item) {
    return list.filter(function(el) {
        return el._id.toString() === item.toString();
    });
}

/**
 * Todo verificar necessidade PROMISE DENTRO DE PROMISE...
 *
 * Busca o hitórico de likes do usuário
 * @param UserModel
 * @param ReadlistModel
 * @param params
 * @param collectionName
 * @param r
 * @param res
 * @returns {*}
 */
bookSchema.statics.historicoLikes = function(UserModel, ReadlistModel , ShopModel , params, collectionName, r, res) {
    var BookModel = this,
        hist = [];

    try{
        params.userId = ObjectId(params.userId);
        var sinopses = [];

        UserModel.findOne({_id: params.userId})
            .then(function(user) {

                var verifica = function(list, item) {
                    return list.filter(function(el) {
                        var pos = descobrePos(list, item);
                        return pos !== -1? item === hist[pos].readlist._id:false;
                    })
                };

                user.likes.forEach(function(el) {
                    if(verifica(hist, el.readlist.toString()).length === 0) {
                        hist.push({
                            readlist: {_id: el.readlist.toString()},
                            books: [{_id: el.book}]
                        })
                    } else {
                        hist[descobrePos(hist, el.readlist.toString())].books.push({_id: el.book})
                    }
                });

                return r.obtem("readlists", ReadlistModel);
            })
            .then(function(result){
                var buscaReadlist = function(list, item) {
                    return list.filter(function(el) {
                        return el._id === item
                    });
                };

                hist.forEach(function(el) {
                    extend(el.readlist, buscaReadlist(result, el.readlist._id)[0]);
                });

                return r.obtem(collectionName, BookModel, {visivel: true});
            })
            .then(function(result){
                //todo revisar o uso de variavel em chain promises, isso pode ter side-effects por quebra de paradigma funcional
                sinopses = result;
                return r.obtem(params.strShop, ShopModel)
            })
            .then(function(result){
                sinopses.forEach(function(el) {
                    el.link.forEach(function(elem) {
                        elem.icon_loja = getLoja(result, elem.loja)[0].icon_url;
                    });
                });

                var buscaBook = function(list, item) {
                    return list.filter(function(el) {
                        return el._id === item
                    });
                };

                hist.forEach(function(el) {
                    el.books.forEach(function(elem) {
                        extend(elem, buscaBook(sinopses, elem._id.toString())[0]);
                    });
                });

                return res.status(200).json(hist);
            })
            .catch(function(erro) {
                return MongooseErr.apiGetMongooseErr(erro,res)
            }
        );
    }catch(erro){
        return MongooseErr.apiGetMongooseErr(erro,res);
    }
};


/**
 * Função para descobrir a posição de um item na lista
 * @param list
 * @param item
 * @returns {number}
 */
function descobrePos(list, item) {
    var pos = 0;

    while (pos < list.length) {
        if (!!list[pos].readlist && list[pos].readlist._id === item) {
            return pos
        }
        pos++;
    }

    return -1
}


bookSchema.statics.refreshLomadee = function() {
    var BookModel = this;

    /*
     1 - obtem a assinatura atual do lomadeee
     2 - varre todos os titulos que nao estiverem com novo codigo do lomadee
     3-  adiciona a chave  neles com o link novo do lomadee
     */
    return ConfAdmin.getConf()
        .then(function (conf) {
            /**
             * buscando livros invalidados que necessitam de update
             */
            return BookModel.find(
                {
                    $or: [{chave_api: {$exists: false}},
                        {chave_api: {$exists: true, $nin: [conf.chave_api]}},
                        {chave_referencia: {$exists: false}},
                        {chave_referencia: {$exists: true, $nin: [conf.chave_referencia]}}
                    ]
                }
            ).then(function (livros) {
                return {livros: livros, conf: conf}
            })
        })
        .then(function (query) {
            /**
             * buscando lojas
             */
            return Shop.find().then(function (lojas) {
                return {livros: query.livros, conf: query.conf, lojas: lojas}
            })
        })
        .then(function (query) {
            console.log('dentro da operacao principal');
            var index;
            // desabilitado na primeira etapa
            //query.livros.forEach(function (livro, index, array) {
            //
            //
            //    /**
            //     * filtra as lojas que possuem lomadee
            //     * @param loja
            //     * @returns {*}
            //     */
            //    function filtraloja (loja) {
            //        var lojaref = query.lojas.filter(function (reg) {
            //
            //            if (typeof loja.loja === 'string') {
            //                return reg.id === loja.loja;
            //            } else {
            //                return loja.loja.toString() === reg.id;
            //            }
            //
            //
            //        });
            //        if (lojaref) {
            //            return lojaref[0].lomadee;
            //        } else {
            //            return false;
            //        }
            //    }
            //
            //    /**
            //     * percorrendo as lojas que possuem lomadee e que nao estejam atualizadas
            //     */
            //    livro.link.filter(filtraloja)
            //        .forEach(
            //            function (lojalivro, index, array) {
            //
            //                var url = 'http://sandbox.buscape.com.br/service/createLinks/lomadee/' + query.conf.chave_api + '/BR/?sourceId=' + query.conf.chave_referencia + '&link1=' + lojalivro.link_loja;
            //
            //                rp(url).then(processa).catch(processaErro);
            //
            //                function processaErro (err) {
            //                    parseString(err.error, function (err2, repostaErro) {
            //                        if (!err2) {
            //                            if (!!repostaErro.Result.details["0"].message["0"]){
            //                                console.log(repostaErro.Result.details["0"].message["0"]);
            //                            }else{
            //                                console.log(repostaErro);
            //                            }
            //                        } else {
            //                            return null;
            //                        }
            //                    });
            //                }
            //
            //                function processa (resposta) {
            //                    //todo melhorar e retirar esse callback hell
            //                    parseString(resposta, function (err, result) {
            //                        if (!err) {
            //                            if (!!result.Result.lomadeeLinks["0"].lomadeeLink["0"].redirectLink[0]) {
            //                                var link_lomadee = result.Result.lomadeeLinks["0"].lomadeeLink["0"].redirectLink[0];
            //                                var links = livro.link;
            //
            //                                links.forEach(function(loja,indice){
            //                                    if (lojalivro.link_loja  = loja.link_loja){
            //                                        links[indice].link_lomadee = link_lomadee;
            //                                    }
            //                                });
            //
            //                                BookModel.update(
            //                                    { _id : ObjectId(livro.id) },
            //                                    {
            //                                        $set: {
            //                                            chave_api: query.conf.chave_api,
            //                                            chave_referencia: query.conf.chave_referencia,
            //                                            link: links
            //                                        }
            //                                    }
            //
            //                                ).then(function(val){
            //                                    console.log(val);
            //                                    //todo resolver e cascatear tudo de tal forma que o flush all executa somente uma vez
            //                                    r.flushall();
            //
            //                                });
            //                            } else {
            //                                return null;
            //                            }
            //                        } else {
            //                            return null;
            //                        }
            //                    });
            //                }
            //            });
            //    })
        })
        .catch(function (err) {
            console.log(err);
        });
};




module.exports = mongoose.model('Book', bookSchema);