/**
 * Created by douglas on 25/11/15.
 */

var ObjectId = require('mongoose').Types.ObjectId;
var sanitize = require('mongo-sanitize');

(function() {
    'use strict';

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('USER test', function () {
        var newUser = {}, categoria = {}, readlist= {}, book = {}, shop = {},
            listBook = ["primeiro", "segundo", "terceiro"],
            emailNewUser = "alert@xdevel.com.br", tokenSignup = "", tokenForgot = "";

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users')
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


        describe('-> UPDATING Password ( Parte 1 )', function () {
            it('-> Requisitando alteração de password para um usuário local inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/forgot')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": emailNewUser,
                        "host":  "Test - book4you-back",
                        "subject": "Book4you api - Teste de alteração de senha do usuário",
                        "template": "Teste de alteração de senha do usuário.\n\nDados: \n" +
                        " - Host: {host}\n - Operação: {op}\n - Token: {token}\n\nO Token também será retornado para ser " +
                        "aproveitado no restante dos testes.\n"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });
        });


        describe('-> CREATING User ( Parte 1 )', function () {
            it('-> Adicionando um usuário local com dados em branco(vazio)', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/signup')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        email: "",
                        host: "",
                        template: "",
                        subject: ""
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Adicionando um novo usuário', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/signup')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": emailNewUser,
                        "host":  "http://localhost:3000",
                        "subject": "Book4you api - Teste de cadastro de usuário",
                        "template": "Teste de cadastro de usuário.\n\nDados: \n" +
                            " - Host: {host}\n - Operação: {op}\n - Token: {token}\n\nO Token também será retornado para ser " +
                            "aproveitado no restante dos testes.\n"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        expect(res.body).to.have.property("success").and.not.be.null;
                        expect(res.body).to.have.property("token").and.not.be.null;
                        tokenSignup = res.body.token;
                        done();
                    });
            });
        });


        describe("VALIDATING Token", function() {
            it('-> Validando token e retornando o usuário se for válido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/signup/' + tokenSignup)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local.email).to.not.be.null;
                        expect(res.body.local.signupToken).to.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });
        });


        describe('-> AUTHENTICATING User ( Parte 1 )', function() {
            it('-> Autenticando usuário local com o email faltando', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": "",
                        "password": "qwerty"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Autenticando usuário local com o password faltando', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": "email@invalido.com",
                        "password": ""
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Autenticando usuário local inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": "email@invalido.com",
                        "password": "qwerty"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Autenticando usuário local, mas os seus dados ainda estão incompletos', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "password": "qwerty"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });
        });


        describe("COMPLETING Registration", function() {
            it('-> Completando cadastro do usuário com email em branco(vazio)', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": "",
                        "local": {}
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Completando cadastro de um usuário inexistente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": "email@invalido.com"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Completando cadastro do usuário com dados em branco(vazio)', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "local": {
                            "name": "",
                            "email": "",
                            "password": ""
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Completando cadastro do usuário', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "local": {
                            "name": "Usuário cadastrado",
                            "email": newUser.email,
                            "password": "123"
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        expect(res.body).to.have.property("success").and.not.be.null;
                        expect(res.body).to.have.property("data").and.be.an('object');
                        newUser = res.body.data;
                        done();
                    });
            });

            it('-> Atualizando dados do novo usuário', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "_id": newUser._id,
                        "local": {
                            "name": "Usuário atualizado"
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("name").and.not.be.null;
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("password").and.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });

            it('-> Atualizando dados do novo usuário junto com a senha', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "_id": newUser._id,
                        "local": {
                            "name": "Usuário cadastrado",
                            "password": "123"
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("name").and.not.be.null;
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("password").and.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });
        });


        describe('-> AUTHENTICATING User ( Parte 2 )', function() {
            it('-> Autenticando usuário local com os passwords diferentes', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "password": "qwerty"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Autenticando usuário local com o password correto', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/auth/local')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "password": "123"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("name").and.not.be.null;
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("password").and.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });
        });


        describe('-> UPDATING Password ( Parte 2 )', function () {
            it('-> Requisitando alteração de password para o usuário com dados em branco(vazio)', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/forgot')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        email: "",
                        host: "",
                        template: "",
                        subject: ""
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Requisitando alteração de password para o usuário cadastrado', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/forgot')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": newUser.email,
                        "host":  "Test - book4you-back",
                        "subject": "Book4you api - Teste de alteração de senha do usuário",
                        "template": "Teste de alteração de senha do usuário.\n\nDados: \n" +
                        " - Host: {host}\n - Operação: {op}\n - Token: {token}\n\nO Token também será retornado para ser " +
                        "aproveitado no restante dos testes.\n"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        expect(res.body).to.have.property("success").and.not.be.null;
                        expect(res.body).to.have.property("token").and.not.be.null;
                        tokenForgot = res.body.token;
                        done();
                    });
            });

            it('-> Validando token de resetPassword e retornando o usuário se for válido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/forgot/' + tokenForgot)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local.email).to.not.be.null;
                        expect(res.body.local.signupToken).to.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });

            it('-> Alterando senha do usuário com o token inválido', function (done) {
                this.timeout(60000);
                supertest(app).put('/api/v1/users/forgot/abcdefghikj')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Alterando senha do usuário', function (done) {
                this.timeout(60000);
                supertest(app).put('/api/v1/users/forgot/' + tokenForgot)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "password": "123456"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local).to.have.property("name").and.not.be.null;
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("password").and.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });

            it('-> Alterando senha do usuário novamente para token expirado', function (done) {
                this.timeout(60000);
                supertest(app).put('/api/v1/users/forgot/' + tokenForgot)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "password": "123456"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Validando usuário para resetPassword pelo token inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/forgot/abcdefghikj')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Validando usuário para resetPassword pelo token expirado', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/forgot/' + tokenForgot)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });
        });


        describe("CREATING User ( Parte 2 )", function() {
            it('-> Adicionando um usuário existente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/users/signup')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "email": emailNewUser,
                        "host":  "http://localhost:3000",
                        "subject": "Book4you api - Teste de cadastro de usuário",
                        "template": "Teste de cadastro de usuário.\n\nDados: \n" +
                        " - Host: {host}\n - Operação: {op}\n - Token: {token}\n\nO Token também será retornado para ser " +
                        "aproveitado no restante dos testes.\n"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });
        });


        describe('-> GET Users', function() {
            it('-> Buscando todos os usuários', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');

                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id").and.not.be.null;
                            expect(res.body[0]).to.have.property("likes").and.not.be.null;
                            expect(res.body[0]).to.have.property("dislikes").and.not.be.null;
                            expect(res.body[0]).to.have.property("categories").and.not.be.null;
                            /*expect(res.body[0]).to.have.property("email");
                            expect(res.body[0].email).to.not.be.null;*/

                            if (!!res.body[0].local && !!res.body[0].local.email) {
                                expect(res.body[0]).to.have.property("name").and.not.be.null;
                                expect(res.body[0]).to.have.property("email").and.not.be.null;
                                expect(res.body[0]).to.have.property("password").and.not.be.null;
                            }

                            if (!!res.body[0].facebook && !!res.body[0].facebook.email) {
                                expect(res.body[0].facebook).to.have.property("id").and.not.be.null;
                                expect(res.body[0].facebook).to.have.property("name").and.not.be.null;
                                expect(res.body[0].facebook).to.have.property("email").and.not.be.null;
                            }

                            if (!!res.body[0].twitter && !!res.body[0].twitter.email) {
                                expect(res.body[0].twitter).to.have.property("id").and.not.be.null;
                                expect(res.body[0].twitter).to.have.property("name").and.not.be.null;
                                expect(res.body[0].twitter).to.have.property("email").and.not.be.null;
                            }

                            if (!!res.body[0].google && !!res.body[0].google.email) {
                                expect(res.body[0].google).to.have.property("id").and.not.be.null;
                                expect(res.body[0].google).to.have.property("name").and.not.be.null;
                                expect(res.body[0].google).to.have.property("email").and.not.be.null;
                            }
                        }
                        done();
                    });
            });

            it('-> Buscando um usuário com id inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Buscando um usuário com id válido mas com erro de cast', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/123x123x123x')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(500);
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Buscando um usuário inexistente', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/1344d78ef8c62e0100859266')
                .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                .set('Accept', 'application/json')
                .end(function (err, res) {
                    if (err) return done(err);
                    expect(err).to.equal(null);
                    expect(res.status).to.equal(404);
                    expect(res.body).to.have.property("msg").and.not.be.null;
                    done();
                });
            });

            it('-> Buscando o usuário cadastrado', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/users/' + newUser._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("email").and.not.be.null;
                        expect(res.body).to.have.property("local").and.be.an('object');
                        expect(res.body.local).to.have.property("email").and.not.be.null;
                        expect(res.body.local).to.have.property("name").and.not.be.null;
                        expect(res.body.local).to.have.property("password").and.not.be.null;
                        newUser = res.body;
                        done();
                    });
            });
        });


//  Área destinada aos testes de categoria, readlist e livro
        describe('-> Criando categoria no teste do usuário', function() {
            it('-> Adicionando uma nova categoria para ser testada pelo usuário', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/categories')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Categoria do Usuário"
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("nome").and.not.be.null;
                        categoria = res.body;
                        done();
                    });
            });
        });


        describe('-> Criando readlist no teste do usuário', function() {
            it('-> Adicionando uma nova readlist corretamente', function (done) {
                this.timeout(120000);
                supertest(app).post('/api/v1/readlists')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        nome: "Readlist criada",
                        descricao: "Readlist criada pelo teste unitário de usuário",
                        icon_url: "www.x.yyy.zz/icon.png",
                        imagem_url : "www.x.yyy.zz/imagem.png",
                        publico: true,
                        categoria: [categoria._id],
                        visivel: true
                    })
                    .expect('Content-Type', /json/i)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.have.property("_id").and.not.be.null;
                        expect(res.body).to.have.property("nome").and.not.be.null;
                        expect(res.body).to.have.property("descricao").and.not.be.null;
                        expect(res.body).to.have.property("icon_url").and.not.be.null;
                        expect(res.body).to.have.property("imagem_url").and.not.be.null;
                        expect(res.body).to.have.property("publico").and.not.be.null;
                        expect(res.body).to.have.property("categoria").and.not.be.null;
                        expect(res.body).to.have.property("visivel").and.not.be.null;
                        readlist = res.body;
                        done();
                    });
            });
        });


        describe("-> Buscando lojas", function() {
            it('-> Buscando todas as lojas', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/shops')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        expect(typeof res.body).to.equal('object');
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);

                        if (res.body.length !== 0) {
                            expect(res.body[0]).to.have.property("_id").and.not.equal(null);
                            expect(res.body[0]).to.have.property("nome").and.not.equal(null);
                            expect(res.body[0]).to.have.property("icon_url").and.not.equal(null);
                            expect(res.body[0]).to.have.property("lomadee").and.not.equal(null);
                            shop = res.body[0];
                        }
                        done();
                    });
            });
        });


        describe('-> Criando livro no teste do usuário', function() {
            listBook.forEach(function(el) {
                it('-> Adicionando o ' + el + ' livro', function (done) {
                    this.timeout(200000);
                    supertest(app).post('/api/v1/books')
                        .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                        .set('Accept', 'application/json')
                        .send({
                            nome: el + " livro adicionado",
                            autor: "x",
                            editora: "qwerty",
                            sinopse: el + " livro adicionado pelo teste unitário do usuário",
                            link: [{nome: shop.nome, loja: shop._id, link_loja: "www.x.yyy.zz/book.png"}],
                            link_original: [],
                            readlist: [readlist._id],
                            visivel: true
                        })
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(err).to.equal(null);
                            expect(res.status).to.equal(201);
                            expect(res.body).to.have.property("_id").and.not.be.null;
                            expect(res.body).to.have.property("sinopse").and.not.be.null;
                            expect(res.body).to.have.property("nome").and.not.be.null;
                            expect(res.body).to.have.property("autor").and.not.be.null;
                            expect(res.body).to.have.property("editora").and.not.be.null;
                            expect(res.body).to.have.property("visivel").and.not.be.null;
                            expect(res.body).to.have.property("readlist").and.not.be.null;
                            expect(res.body).to.have.property("link").and.not.be.null;
                            expect(res.body).to.have.property("link_original").and.not.be.null;
                            book[el] = res.body;
                            done();
                        });
                });
            });
        });


        describe("-> Adicionando categorias para o usuário", function() {
            it('-> Atualizando as categorias do usuário com a categoria inválida', function (done) {
                this.timeout(60000);
                supertest(app).put('/api/v1/users/atualizaCategoria')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "userId": newUser._id,
                        "categories": [
                            "1234567890"
                        ]
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Atualizando as categorias do usuário corretamente', function (done) {
                this.timeout(60000);
                supertest(app).put('/api/v1/users/atualizaCategoria')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        "userId": newUser._id,
                        "categories": [
                            {
                                "id": categoria._id,
                                "nome":categoria.nome,
                                "active":true
                            }

                        ]
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        done();
                    });
            });
        });


        describe("-> Obtem sinopses das readlist ( Parte 1 )", function() {
            it('-> Buscando as sinopses com readlist inválida', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/sinopses/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Buscando as sinopses das readlists de usuário não logado', function (done) {
                this.timeout(120000);
                supertest(app).get('/api/v1/sinopses/' + readlist._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');

                        if (res.body.length > 0) {
                            expect(res.body[0]).to.have.property("_id").and.not.be.null;
                            expect(res.body[0]).to.have.property("sinopse").and.not.be.null;
                            expect(res.body[0]).to.have.property("nome").and.not.be.null;
                            expect(res.body[0]).to.have.property("autor").and.not.be.null;
                            expect(res.body[0]).to.have.property("editora").and.not.be.null;
                            expect(res.body[0]).to.have.property("visivel").and.not.be.null;
                            expect(res.body[0]).to.have.property("readlist").and.be.an('Array');
                            expect(res.body[0]).to.have.property("link_original").and.be.an('Array');
                            expect(res.body[0]).to.have.property("link").and.be.an('Array');
                        }
                        done();
                    });
            });

            it('-> Buscando as sinopses com userId inválido', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/sinopses/' + readlist._id + '/1')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Buscando as sinopses das readlists de usuário logado', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/sinopses/' + readlist._id + '/' + newUser._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        expect(res.body.length).to.equal(3);

                        expect(res.body[0]).to.have.property("_id").and.not.be.null;
                        expect(res.body[0]).to.have.property("sinopse").and.not.be.null;
                        expect(res.body[0]).to.have.property("nome").and.not.be.null;
                        expect(res.body[0]).to.have.property("autor").and.not.be.null;
                        expect(res.body[0]).to.have.property("editora").and.not.be.null;
                        expect(res.body[0]).to.have.property("visivel").and.not.be.null;
                        expect(res.body[0]).to.have.property("readlist").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link_original").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link").and.be.an('Array');
                        done();
                    });
            });
        });


        describe("-> Requisitando like e dislike", function() {
            it('-> Dando like no livro com os dados em branco', function (done) {
                this.timeout(90000);
                supertest(app).post('/api/v1/books/likes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: "",
                        readlistId: "",
                        bookId: ""
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Dando like no primeiro livro cadastrado pelo teste do usuário', function (done) {
                this.timeout(90000);
                supertest(app).post('/api/v1/books/likes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: newUser._id,
                        readlistId: readlist._id,
                        bookId: book["primeiro"]._id
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        done();
                    });
            });

            it('-> Dando dislike no segundo livro cadastrado pelo teste do usuário', function (done) {
                this.timeout(90000);
                supertest(app).post('/api/v1/books/dislikes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: newUser._id,
                        readlistId: readlist._id,
                        bookId: book["segundo"]._id
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        done();
                    });
            });
        });


        describe("-> Histórico de likes", function() {
            it('-> Requisitando histórico de likes de um usuário inválido', function (done) {
                this.timeout(120000);
                supertest(app).get('/api/v1/books/historicoLikes/1234567890')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('msg').and.not.be.null;
                        done();
                    });
            });

            it('-> Requisitando histórico de likes do usuário criado', function (done) {
                this.timeout(120000);
                supertest(app).get('/api/v1/books/historicoLikes/' + newUser._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        expect(res.body.length).to.equal(1);
                        expect(res.body[0]).to.have.property('readlist').and.not.be.null;
                        expect(res.body[0].readlist).to.be.an('object');
                        expect(res.body[0]).to.have.property('books').and.not.be.null;
                        expect(res.body[0].books).to.be.an('Array');
                        expect(res.body[0].books[0]).to.be.an('object');
                        done();
                    });
            });
        });

        describe("-> Obtem sinopses das readlist ( Parte 2 )", function() {
            it('-> Buscando as sinopses das readlists novamente para usuário logado', function (done) {
                this.timeout(120000);
                supertest(app).get('/api/v1/sinopses/' + readlist._id + '/' + newUser._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        expect(res.body.length).to.equal(1);

                        expect(res.body[0]).to.have.property("_id").and.not.be.null;
                        expect(res.body[0]).to.have.property("sinopse").and.not.be.null;
                        expect(res.body[0]).to.have.property("nome").and.not.be.null;
                        expect(res.body[0]).to.have.property("autor").and.not.be.null;
                        expect(res.body[0]).to.have.property("editora").and.not.be.null;
                        expect(res.body[0]).to.have.property("visivel").and.not.be.null;
                        expect(res.body[0]).to.have.property("readlist").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link_original").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link").and.be.an('Array');
                        done();
                    });
            });
        });

        describe("-> Resetando dislikes", function() {
            it('-> Resetando dislikes com o usuário e a readlist em branco', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/books/resetaDislikes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: "",
                        readlistId: ""
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Resetando dislikes com o usuário e a readlist inválidos', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/books/resetaDislikes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: "1234567890",
                        readlistId: "1234567890"
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(400);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg").and.not.be.null;
                        done();
                    });
            });

            it('-> Resetando dislikes do usuário corretamente', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1/books/resetaDislikes')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: newUser._id,
                        readlistId: readlist._id
                    })
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        done();
                    });
            });
        });

        describe("-> Obtem sinopses das readlist ( Parte 3 )", function() {
            it('-> Buscando as sinopses das readlists novamente para usuário logado', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/sinopses/' + readlist._id + '/' + newUser._id)
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('Array');
                        expect(res.body.length).to.equal(2);

                        expect(res.body[0]).to.have.property("_id").and.not.be.null;
                        expect(res.body[0]).to.have.property("sinopse").and.not.be.null;
                        expect(res.body[0]).to.have.property("nome").and.not.be.null;
                        expect(res.body[0]).to.have.property("autor").and.not.be.null;
                        expect(res.body[0]).to.have.property("editora").and.not.be.null;
                        expect(res.body[0]).to.have.property("visivel").and.not.be.null;
                        expect(res.body[0]).to.have.property("readlist").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link_original").and.be.an('Array');
                        expect(res.body[0]).to.have.property("link").and.be.an('Array');
                        done();
                    });
            });
        });
// Fim


        describe("-> DELETING Area", function() {
            describe("-> Deletando livros", function() {
                listBook.forEach(function(el) {
                    it('-> Deletando ' + el + ' livro do teste do usuário', function (done) {
                        this.timeout(300000);
                        supertest(app).delete('/api/v1/books/' + book[el]._id)
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
                });
            });


            describe("-> Deletando readlist", function() {
                it('-> Deletando a readlist criada para testar o usuário', function (done) {
                    this.timeout(120000);
                    supertest(app).delete('/api/v1/readlists/' + readlist._id)
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
            });


            describe("-> Deletando categoria", function() {
                it('-> Deletando a categoria criada para testar o usuário', function (done) {
                    this.timeout(120000);
                    supertest(app).delete('/api/v1/categories/' + categoria._id)
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
            });


            describe("-> Deletando usuário", function() {
                it('-> Deletando um usuário inválido', function (done) {
                    this.timeout(120000);
                    supertest(app).delete('/api/v1/users/1234567890')
                        .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(err).to.equal(null);
                            expect(res.status).to.equal(400);
                            expect(res.body).to.have.property("msg").and.not.be.null;
                            done();
                        });
                });

                it('-> Deletando o usuário criado', function (done) {
                    this.timeout(120000);
                    supertest(app).delete('/api/v1/users/' + newUser._id)
                        .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                        .set('Accept', 'application/json')
                        .expect('Content-Type', /json/)
                        .end(function (err, res) {
                            if (err) return done(err);
                            expect(err).to.equal(null);
                            expect(res.status).to.equal(200);
                            expect(res.body).to.have.property("success").and.equal(true);
                            done();
                        });
                });
            });
        });
    });
})();