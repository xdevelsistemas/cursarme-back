(function() {
    'use strict';

    // generating code coverage
    // istanbul cover _mocha test/**/*Spec.js -- . -R spec

    var chai = require('chai');
    var should = chai.should();
    var expect = chai.expect;
    var supertest = require('supertest');
    var app = require('../app');

    describe('PERMLOGIN test', function () {
        var newAuthor = {};

        describe('-> Unauthorized', function () {
            it('-> Requisição não autorizada', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/authors')
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

        describe('-> GET PermLogin', function () {
            it('-> Verificando acesso de usuário sem permissão', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/permlogins/email@invalido.com')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("msg");
                        expect(res.body.msg).to.not.be.null;
                        expect(res.body).to.not.have.property("success");
                        done();
                    });
            });

            it('-> Verificando acesso de usuário com permissão', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1/permlogins/douglas.lima@xdevel.com.br')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property("success");
                        expect(res.body.success).to.not.be.null;
                        expect(res.body).to.not.have.property("msg");
                        done();
                    });
            });
        })
    });
})();