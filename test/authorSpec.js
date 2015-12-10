(function() {
    'use strict';

    // generating code coverage
    // istanbul cover _mocha test/**/*Spec.js -- . -R spec

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('AUTHOR test', function () {
        var newAuthor = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/authors')
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

        describe('-> GET Authors', function () {
            it('-> Buscando todos os autores', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/authors')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(typeof res.body).to.equal('object');
                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.equal(null);
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.equal(null);
                        }
                        done();
                    });
            });

            it('-> Buscando um autor com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/authors/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
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

            it('-> Buscando um autor inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/authors/123x123x123x123x123x123x')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
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

            it('-> Buscando o autor 560ffe964e4df77d92f3f109', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/authors/560ffe964e4df77d92f3f109')
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
                        done();
                    });
            });
        });

        describe('-> POST Authors', function () {
            it('-> Adicionando um autor com nome vazio', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/authors')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: ""
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

            it('-> Adicionando um novo autor', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/authors')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Autor criado"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.not.equal("");
                        newAuthor = res.body;
                        done();
                    });
            });

            it('-> Atualizando um autor inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/authors')
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

            it('-> Atualizando o nome de um author para \'\'', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/authors')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newAuthor._id,
                        nome: ""
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

            it('-> Atualizando um autor corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/authors')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newAuthor._id,
                        nome: "Autor atualizado"
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
                        newAuthor = res.body;
                        done();
                    });
            });
        });

        describe('-> DELETE Authors', function () {
            it('-> Deletando um autor com o id inválido', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/authors/1234567890')
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

            it('-> Deletando um autor inexistente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/authors/123x123x123x123x123x123x')
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

            it('-> Deletando um autor corretamente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/authors/' + newAuthor._id)
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