(function() {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('CATEGORY test', function () {
        var newCategory = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/categories')
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

        describe('-> GET Categories', function () {
            it('-> Buscando todas as categorias', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/categories')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        expect(typeof res.body).to.equal('object');
                        if (res.body.length !== 0) {
                            if (err) return done(err);
                            expect(err).to.equal(null);
                            expect(res.status).to.equal(200);
                            expect(res.body[0]).to.have.property("_id");
                            expect(res.body[0]._id).to.not.equal(null);
                            expect(res.body[0]).to.have.property("nome");
                            expect(res.body[0].nome).to.not.equal(null);
                        }
                        done();
                    });
            });

            it('-> Buscando uma categoria com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/categories/1234567890')
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

            it('-> Buscando uma categoria inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/categories/123x123x123x123x123x123x')
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

            it('-> Buscando a categoria 5602ff9eb57c5d0b00d9a411', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/categories/5602ff9eb57c5d0b00d9a411')
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

        describe('-> POST Categories', function () {
            it('-> Adicionando uma categoria com nome vazio', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/categories')
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

            it('-> Adicionando uma nova categoria', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/categories')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Categoria criada"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.equal("Categoria criada");
                        newCategory = res.body;
                        done();
                    });
            });

            it('-> Atualizando uma categoria inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/categories')
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

            it('-> Atualizando o nome de uma categoria para \'\'', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/categories')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newCategory._id,
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

            it('-> Atualizando categoria corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/categories')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newCategory._id,
                        nome: "Categoria atualizada"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.equal("Categoria atualizada");
                        newCategory = res.body;
                        done();
                    });
            });
        });

        describe('-> DELETE Category', function () {
            it('-> Deletando uma categoria com o id inválido', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/categories/1234567890')
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

            it('-> Deletando uma categoria inexistente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/categories/123x123x123x123x123x123x')
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

            it('-> Deletando uma categoria criada', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/categories/' + newCategory._id)
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