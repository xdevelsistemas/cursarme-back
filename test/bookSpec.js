(function() {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('BOOK test', function () {
        var newBook = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books')
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.error.text).to.equal("Unauthorized");
                        done();
                    });
            });
        });

        describe('-> GET Books', function () {
            it('-> Buscando todos os livros', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.be.null;
                            expect(res.body[0]).to.have.property("sinopse");
                            expect(res.body[0].sinopse).to.not.be.null;
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.be.null;
                            expect(res.body[0]).to.have.property("autor");
                            expect(res.body[0].autor).to.not.be.null;
                            expect(res.body[0]).to.have.property("editora");
                            expect(res.body[0].editora).to.not.be.null;
                            expect(res.body[0]).to.have.property("visivel");
                            expect(res.body[0].visivel).to.not.be.null;
                            expect(res.body[0]).to.have.property("readlist");
                            expect(res.body[0].readlist).to.not.be.null;
                            expect(res.body[0]).to.have.property("link");
                            expect(res.body[0].link).to.not.be.null;
                            expect(res.body[0]).to.have.property("link_original");
                            expect(res.body[0].link_original).to.not.be.null;
                        }
                        done();
                    });
            });

            it('-> Buscando um livro com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("sinopse");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("autor");
                        expect(res.body).to.not.have.property("editora");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("readlist");
                        expect(res.body).to.not.have.property("link");
                        expect(res.body).to.not.have.property("link_original");
                        done();
                    });
            });

            it('-> Buscando um livro com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books/123456789012')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(500);
                        expect(res.body).to.have.property("err");
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("sinopse");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("autor");
                        expect(res.body).to.not.have.property("editora");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("readlist");
                        expect(res.body).to.not.have.property("link");
                        expect(res.body).to.not.have.property("link_original");
                        done();
                    });
            });

            it('-> Buscando um livro inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books/5654ae3b4e3708f76b7b2dd1')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(404);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("sinopse");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("autor");
                        expect(res.body).to.not.have.property("editora");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("readlist");
                        expect(res.body).to.not.have.property("link");
                        expect(res.body).to.not.have.property("link_original");
                        done();
                    });
            });

            it('-> Buscando o livros 56104c49d0264784b478957d', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/books/56104c49d0264784b478957d')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.be.null;
                        expect(res.body).to.have.property("sinopse");
                        expect(res.body.sinopse).to.not.be.null;
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.be.null;
                        expect(res.body).to.have.property("autor");
                        expect(res.body.autor).to.not.be.null;
                        expect(res.body).to.have.property("editora");
                        expect(res.body.editora).to.not.be.null;
                        expect(res.body).to.have.property("visivel");
                        expect(res.body.visivel).to.not.be.null;
                        expect(res.body).to.have.property("readlist");
                        expect(res.body.readlist).to.not.be.null;
                        expect(res.body).to.have.property("link");
                        expect(res.body.link).to.not.be.null;
                        expect(res.body).to.have.property("link_original");
                        expect(res.body.link_original).to.not.be.null;
                        done();
                    });
            });

            it('Requisitando livros para a página 1 do grid no admin', function(done) {
                this.timeout(60000);
                var size = 10;
                supertest(app).get('/api/v1.1/booksPagination?page=1&size=' + size + '&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        expect(res.body).to.have.length.of.at.most(size);
                        if (res.body.length > 0) expect(res.body[0]).to.be.an('object');
                        done();
                    });
            });

            it('Requisitando livros para a página 0 do grid no admin', function(done) {
                this.timeout(60000);
                var size = 10;
                supertest(app).get('/api/v1.1/booksPagination?page=0&size=' + size + '&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.not.be.an('Array');
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('Requisitando livros com quantidade 0 para a página do grid no admin', function(done) {
                this.timeout(60000);
                var size = 0;
                supertest(app).get('/api/v1.1/booksPagination?page=1&size=' + size + '&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.not.be.an('Array');
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('Requisitando livros sem enviar o número da página', function(done) {
                this.timeout(60000);
                var size = 10;
                supertest(app).get('/api/v1.1/booksPagination?size=' + size + '&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.not.be.an('Array');
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('Requisitando livros sem enviar a quantidade de livros da página', function(done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/booksPagination?page=1&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.not.be.an('Array');
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('Requisitando total de páginas para o grid do admin', function(done) {
                this.timeout(60000);
                var size = 10;
                supertest(app).get('/api/v1.1/bookTotalPages?size=' + size + '&filter=')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("bookTotalPages");
                        done();
                    });
            });
        });

        describe('-> POST Books', function () {
            it('-> Adicionando um livro com os campos em branco(vazios)', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "",
                        autor: "",
                        editora: "",
                        sinopse: "",
                        link: [],
                        link_original: [],
                        readlist: [],
                        visivel: true
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(500);
                        expect(res.body).to.have.property("err");
                        expect(res.body).to.have.property("fields");
                        done();
                    });
            });

            it('-> Adicionando um novo livro', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Livro adicionado",
                        autor: "x",
                        editora: "qwerty",
                        sinopse: "Livro adicionado pelo teste unitário",
                        link: ['1'],
                        link_original: ['2'],
                        readlist: ["5602ffdeb57c5d0b00d9a412"],
                        visivel: true
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.be.null;
                        expect(res.body._id).to.not.equal("");
                        expect(res.body).to.have.property("sinopse");
                        expect(res.body.sinopse).to.not.be.null;
                        expect(res.body.sinopse).to.not.equal("");
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.be.null;
                        expect(res.body.nome).to.not.equal("");
                        expect(res.body).to.have.property("autor");
                        expect(res.body.autor).to.not.be.null;
                        expect(res.body.autor).to.not.equal("");
                        expect(res.body).to.have.property("editora");
                        expect(res.body.editora).to.not.be.null;
                        expect(res.body.editora).to.not.equal("");
                        expect(res.body).to.have.property("visivel");
                        expect(res.body.visivel).to.not.be.null;
                        expect(res.body.visivel).to.not.equal("");
                        expect(res.body).to.have.property("readlist");
                        expect(res.body.readlist).to.not.be.null;
                        expect(res.body.readlist).to.not.equal("");
                        expect(res.body).to.have.property("link");
                        expect(res.body.link).to.not.be.null;
                        expect(res.body.link).to.not.equal("");
                        expect(res.body).to.have.property("link_original");
                        expect(res.body.link_original).to.not.be.null;
                        expect(res.body.link_original).to.not.equal("");
                        newBook = res.body;
                        done();
                    });
            });

            it('-> Atualizando um livro inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: '123x123x123x123x123x123x',
                        nome: "Tem que dá errado"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body._id).to.equal(undefined);
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body.nome).to.equal(undefined);
                        done();
                    });
            });

            it('-> Atualizando o nome de um livro para \'\'', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newBook._id,
                        nome: ""
                    })
                    .expect('Content-Type', /json/i)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('-> Atualizando um livro corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/books')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newBook._id,
                        nome: "Livro atualizado"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.equal("");
                        newBook = res.body;
                        done();
                    });
            });
        });

        describe('-> DELETE Books', function () {
            it('-> Deletando um livro com o id inválido', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/books/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body._id).to.equal(undefined);
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body.nome).to.equal(undefined);
                        expect(res.body).to.not.have.property("success");
                        expect(res.body.success).to.equal(undefined);
                        done();
                    });
            });

            it('-> Deletando um livro inexistente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/books/123x123x123x123x123x123x')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body._id).to.equal(undefined);
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body.nome).to.equal(undefined);
                        expect(res.body).to.not.have.property("success");
                        expect(res.body.success).to.equal(undefined);
                        done();
                    });
            });

            it('-> Deletando um livro corretamente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/books/' + newBook._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("success");
                        expect(res.body.success).to.equal(true);
                        done();
                    });
            });
        })
    });
})();