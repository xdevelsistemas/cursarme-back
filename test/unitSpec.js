(function() {
    'use strict';

    // generating code coverage
    // istanbul cover _mocha test/**/*Spec.js -- . -R spec

    const chai = require('chai');
    const should = chai.should();
    const expect = chai.expect;
    const supertest = require('supertest');
    const app = require('../app');

    describe('UNIT test', () => {
        describe('-> Unauthorized', () => {
            it('-> Requisição não autorizada', (done) => {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/units')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(401);
                        expect(res.error.text).to.equal("Unauthorized");
                        done();
                    });
            });
        });

        describe('-> GET Unit', function () {
            it('-> Buscando todos as unidades', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/units')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(200);
                        expect(typeof res.body).to.equal('object');
                        if (res.body.length !== 0) {
                            /*expect(res.body[0]).to.have.property();
                            expect(res.body[0]._id).to.not.equal();
                            expect(res.body[0]).to.have.property();
                            expect(res.body[0].nome).to.not.equal();*/
                        }
                        done();
                    });
            });
        });

        describe('-> POST Unit', function () {
            it('-> Atualizando unidade', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/updateUnit')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        /**
                         * dados para a atualização
                         */
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        /*expect(res.status).to.equal(/!* status esperado *!/);
                        expect(res.body).to.have.property();
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property();
                        expect(res.body.nome).to.not.equal();*/
                        done();
                    });
            });

            it('-> Atualizando unidade', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/updateUnit')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        /**
                         * dados para a atualização
                         */
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (err) return done(err);
                        expect(err).to.equal(null);
                        /*expect(res.status).to.equal(/!* status esperado *!/);
                        expect(res.body).to.have.property();
                        expect(res.body._id).to.not.equal(null);
                        expect(res.body).to.have.property();
                        expect(res.body.nome).to.not.equal();*/
                        done();
                    });
            });
        });
    });
})();