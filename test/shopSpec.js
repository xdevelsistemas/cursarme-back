(function() {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('SHOP test', function () {
        var newShop = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/shops')
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

        describe('-> GET Shops', function () {
            it('-> Buscando todas as lojas', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/shops')
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
                            expect(res.body[0]).to.have.property("icon_url");
                            expect(res.body[0].icon_url).to.not.equal(null);
                            expect(res.body[0]).to.have.property("lomadee");
                            expect(res.body[0].lomadee).to.not.equal(null);
                        }
                        done();
                    });
            });

            it('-> Buscando uma loja com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/shops/1234567890')
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        done();
                    });
            });

            it('-> Buscando uma loja inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/shops/123x123x123x123x123x123x')
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        done();
                    });
            });

            it('-> Buscando a loja 560f144544ce1203136dfb05', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/shops/560f144544ce1203136dfb05')
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
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.not.equal(null);
                        expect(res.body).to.have.property("lomadee");
                        expect(res.body.lomadee).to.not.equal(null);
                        done();
                    });
            });
        });

        describe('-> POST Shops', function () {
            it('-> Adicionando uma loja com nome vazio', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/shops')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "",
                        icon_url: "www.x.yyy.zz",
                        lomadee: false
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        done();
                    });
            });

            it('-> Adicionando uma nova loja', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/shops')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Loja criada",
                        icon_url: "www.x.yyy.zz",
                        lomadee: false
                    })
                    .expect('Content-Type', /json/i)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.equal("Loja criada");
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.equal("www.x.yyy.zz");
                        expect(res.body).to.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(false);
                        newShop = res.body;
                        done();
                    });
            });

            it('-> Atualizando uma loja inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/shops')
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        done();
                    });
            });

            it('-> Atualizando o nome de uma loja para \'\'', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/shops')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newShop._id,
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        done();
                    });
            });

            it('-> Atualizando loja corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/shops')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        _id: newShop._id,
                        nome: "Loja atualizada"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id");
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).to.equal("Loja atualizada");
                        expect(res.body).to.have.property("icon_url");
                        expect(res.body.icon_url).to.equal("www.x.yyy.zz");
                        expect(res.body).to.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(false);
                        newShop = res.body;
                        done();
                    });
            });
        });

        describe('-> DELETE Shop', function () {
            it('-> Deletando uma loja com o id inválido', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/shops/1234567890')
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        expect(res.body).to.not.have.property("success");
                        expect(res.body.success).to.equal(undefined);
                        done();
                    });
            });

            it('-> Deletando uma loja inexistente', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/shops/123x123x123x123x123x123x')
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
                        expect(res.body).to.not.have.property("icon_url");
                        expect(res.body.icon_url).to.equal(undefined);
                        expect(res.body).to.not.have.property("lomadee");
                        expect(res.body.lomadee).to.equal(undefined);
                        expect(res.body).to.not.have.property("success");
                        expect(res.body.success).to.equal(undefined);
                        done();
                    });
            });

            it('-> Deletando uma loja criada', function (done) {
                this.timeout(60000);
                supertest(app).delete('/api/v1.1/shops/' + newShop._id)
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