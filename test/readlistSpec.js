(function() {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('READLIST test', function () {
        var newReadlist = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/readlists')
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

        describe('-> GET Readlists', function () {
            it('-> Buscando todas as readlists', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');

                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.equal(null);
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.equal(null);
                            expect(res.body[0]).to.have.property("descricao");
                            expect(res.body[0].descricao).to.not.equal(null);
                            expect(res.body[0]).to.have.property("imagem_url");
                            expect(res.body[0].imagem_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("icon_url");
                            expect(res.body[0].icon_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("publico");
                            expect(res.body[0].publico).to.not.equal(null);
                            expect(res.body[0]).to.have.property("visivel");
                            expect(res.body[0].visivel).to.not.equal(null);
                            expect(res.body[0]).to.have.property("categoria");
                            expect(res.body[0].categoria).to.not.equal(null);
                        }
                        done();
                    });
            });

            it('-> Buscando uma readlist com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/readlists/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("categoria");
                        done();
                    });
            });

            it('-> Buscando uma readlist inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/readlists/123x123x123x123x123x123x')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("categoria");
                        done();
                    });
            });

            it('-> Buscando a readlist 560301b7b57c5d0b00d9a41c', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/readlists/560301b7b57c5d0b00d9a41c')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.equal(null);
                        expect(res.body).to.have.property("descricao");
                        expect(res.body.descricao).to.not.equal(null);
                        expect(res.body).to.have.property("imagem_url");
                        expect(res.body.imagem_url).to.not.equal(null);
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.not.equal(null);
                        expect(res.body).to.have.property("publico");
                        expect(res.body.publico).to.not.equal(null);
                        expect(res.body).to.have.property("visivel");
                        expect(res.body.visivel).to.not.equal(null);
                        expect(res.body).to.have.property("categoria");
                        expect(res.body.categoria).to.not.equal(null);
                        done();
                    });
            });

            it('-> Buscando trend-topics das readlists', function(done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/trend-topics')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');

                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.equal(null);
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.equal(null);
                            expect(res.body[0]).to.have.property("descricao");
                            expect(res.body[0].descricao).to.not.equal(null);
                            expect(res.body[0]).to.have.property("imagem_url");
                            expect(res.body[0].imagem_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("icon_url");
                            expect(res.body[0].icon_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("publico");
                            expect(res.body[0].publico).to.not.equal(null);
                            expect(res.body[0]).to.have.property("visivel");
                            expect(res.body[0].visivel).to.not.equal(null);
                            expect(res.body[0]).to.have.property("categoria");
                            expect(res.body[0].categoria).to.not.equal(null);
                        }
                        done();
                    });
            });

            it('-> Buscando as readlists filtradas pelas categorias com id inválido do usuário', function(done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/123456789012/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(500);
                        expect(res.body).to.not.be.an('array');
                        expect(res.body).to.have.property("err");
                        done();
                    });
            });

            it('-> Buscando as readlists filtradas pelas categorias de um usuário inexistente', function(done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/123x123x123x123x123x123x/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.not.be.an('array');
                        expect(res.body).to.have.property("msg");
                        done();
                    });
            });

            it('-> Buscando as readlists filtradas pelas categorias do usuário 5640fa388698bb01006f6c69', function(done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/5640fa388698bb01006f6c69/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');

                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.equal(null);
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.equal(null);
                            expect(res.body[0]).to.have.property("descricao");
                            expect(res.body[0].descricao).to.not.equal(null);
                            expect(res.body[0]).to.have.property("imagem_url");
                            expect(res.body[0].imagem_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("icon_url");
                            expect(res.body[0].icon_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("publico");
                            expect(res.body[0].publico).to.not.equal(null);
                            expect(res.body[0]).to.have.property("visivel");
                            expect(res.body[0].visivel).to.not.equal(null);
                            expect(res.body[0]).to.have.property("categoria");
                            expect(res.body[0].categoria).to.not.equal(null);
                        }
                        done();
                    });
            });
        });

        describe('-> POST Readlists', function () {
            it('-> Adicionando uma readlist com nome vazio', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "",
                        descricao: "Readlist criada pelo teste unitário",
                        icon_url: "www.x.yyy.zz/icon.png",
                        imagem_url : "www.x.yyy.zz/imagem.png",
                        publico: true,
                        categoria: [],
                        visivel: true
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("categoria");
                        expect(res.body).to.not.have.property("visivel");
                        done();
                    });
            });

            it('-> Adicionando uma readlist com a lista de categorias vazia', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Readlist criada",
                        descricao: "Readlist criada pelo teste unitário",
                        icon_url: "www.x.yyy.zz/icon.png",
                        imagem_url : "www.x.yyy.zz/imagem.png",
                        publico: true,
                        categoria: [],
                        visivel: true
                    })
                    .expect('Content-Type', /json/i)
                    .end(function (err, res) {
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("categoria");
                        expect(res.body).to.not.have.property("visivel");
                        done();
                    });
            });

            it('-> Adicionando uma nova readlist corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Readlist criada",
                        descricao: "Readlist criada pelo teste unitário",
                        icon_url: "www.x.yyy.zz/icon.png",
                        imagem_url : "www.x.yyy.zz/imagem.png",
                        publico: true,
                        categoria: ['1'],
                        visivel: true
                    })
                    .expect('Content-Type', /json/i)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.be.null;
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.be.null;
                        expect(res.body).to.have.property("descricao");
                        expect(res.body.descricao).to.not.be.null;
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.not.be.null;
                        expect(res.body).to.have.property("imagem_url");
                        expect(res.body.imagem_url).to.not.be.null;
                        expect(res.body).to.have.property("publico");
                        expect(res.body.publico).to.not.be.null;
                        expect(res.body).to.have.property("categoria");
                        expect(res.body.categoria).to.not.be.null;
                        expect(res.body).to.have.property("visivel");
                        expect(res.body.visivel).to.not.be.null;
                        newReadlist = res.body;
                        done();
                    });
            });

            it('-> Atualizando uma readlist inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: '123x123x123x123x123x123x',
                        nome: "Tem que dá errado",
                        descricao: "Não existe readlist com esse id no banco"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("categoria");
                        expect(res.body).to.not.have.property("visivel");
                        done();
                    });
            });

            it('-> Atualizando o nome de uma readlist para \'\'', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newReadlist._id,
                        nome: "",
                        descricao: "Deve dar errado, pois o novo nome está em branco(vazio)"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("categoria");
                        expect(res.body).to.not.have.property("visivel");
                        done();
                    });
            });

            it('-> Atualizando readlist corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newReadlist._id,
                        nome: "Readlist atualizada",
                        descricao: "Readlist atualizada pelo teste unitário"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.be.null;
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.be.null;
                        expect(res.body).to.have.property("descricao");
                        expect(res.body.descricao).to.not.be.null;
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.not.be.null;
                        expect(res.body).to.have.property("imagem_url");
                        expect(res.body.imagem_url).to.not.be.null;
                        expect(res.body).to.have.property("publico");
                        expect(res.body.publico).to.not.be.null;
                        expect(res.body).to.have.property("categoria");
                        expect(res.body.categoria).to.not.be.null;
                        expect(res.body).to.have.property("visivel");
                        expect(res.body.visivel).to.not.be.null;
                        newReadlist = res.body;
                        done();
                    });
            });
        });

        describe('-> DELETE Readlist', function () {
            it('-> Deletando uma readlist com o id inválido', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/readlists/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("success");
                        done();
                    });
            });

            it('-> Deletando uma reslist inexistente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/readlists/123x123x123x123x123x123x')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg");
                        expect(res.body).to.not.have.property("_id");
                        expect(res.body).to.not.have.property("nome");
                        expect(res.body).to.not.have.property("descricao");
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body).to.not.have.property("imagem_url");
                        expect(res.body).to.not.have.property("publico");
                        expect(res.body).to.not.have.property("categoria");
                        expect(res.body).to.not.have.property("visivel");
                        expect(res.body).to.not.have.property("success");
                        done();
                    });
            });

            it('-> Deletando uma readlist criada', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/readlists/' + newReadlist._id)
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