(() => {
    'use strict';

    const chai = require('chai');
    const should = chai.should();
    const expect = chai.expect;
    const supertest = require('supertest');
    const app = require('../app');

    describe('UNIT test : endpoint', () => {
        let newUnit = {};

        describe('-> Unauthorized', () => {
            it('-> Requisição não autorizada', (done) => {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/units')
                    .set('Accept', 'application/json')
                    .end((err, res) => {
                        if (!!err) return done(err);
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
                        if (!!err) return done(err);
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
            it('-> Adicionando unidade', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/addUnit')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: ObjectId("5697face19d3c9021d774490"),
                        unit: {
                            name: "Unidade teste unitário",
                            address: {
                                street: "Vale",
                                number: "123",
                                complement: "",
                                neighborhood: "Santo Antônio",
                                city: "Vitória",
                                state: "Espírito Santo",
                                country: "Brasil",
                                postalCode: "01234560",
                                enabled: true
                            },
                            cnpj: "36625217000134",
                            alias: "Teste",
                            phone: "99999999999",
                            website: "www.x.yyy.zz",
                            director: ObjectId("5697face19d3c9021d774496"),
                            directorAuthorization: "0123456789",
                            secretary: ObjectId("5697face19d3c9021d774497"),
                            secretaryAuthorization: "0123456789"
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.be.an('object').and.to.have.property("_id");
                        expect(res.body._id).not.to.be.null;
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).not.to.be.null;
                        expect(res.body).to.have.property("address");
                        expect(res.body.address).to.be.an('array').and.to.have.property("street");
                        expect(res.body.address.street).not.to.be.null;
                        expect(res.body.address).to.have.property("number");
                        expect(res.body.address.number).not.to.be.null;
                        expect(res.body.address).to.have.property("complement");
                        expect(res.body.address.complement).not.to.be.null;
                        expect(res.body.address).to.have.property("neighborhood");
                        expect(res.body.address.neighborhood).not.to.be.null;
                        expect(res.body.address).to.have.property("city");
                        expect(res.body.address.city).not.to.be.null;
                        expect(res.body.address).to.have.property("state");
                        expect(res.body.address.state).not.to.be.null;
                        expect(res.body.address).to.have.property("country");
                        expect(res.body.address.country).not.to.be.null;
                        expect(res.body.address).to.have.property("postalCode");
                        expect(res.body.address.postalCode).not.to.be.null;
                        expect(res.body.address).to.have.property("enabled");
                        expect(res.body.address.enabled).not.to.be.null;
                        expect(res.body).to.have.property("cnpj");
                        expect(res.body.cnpj).not.to.be.null;
                        expect(res.body).to.have.property("alias");
                        expect(res.body.alias).not.to.be.null;
                        expect(res.body).to.have.property("phone");
                        expect(res.body.phone).not.to.be.null;
                        expect(res.body).to.have.property("website");
                        expect(res.body.website).not.to.be.null;
                        expect(res.body).to.have.property("director");
                        expect(res.body.director).not.to.be.null;
                        expect(res.body).to.have.property("directorAuthorization");
                        expect(res.body.directorAuthorization).not.to.be.null;
                        expect(res.body).to.have.property("secretary");
                        expect(res.body.secretary).not.to.be.null;
                        expect(res.body).to.have.property("secretaryAuthorization");
                        expect(res.body.secretaryAuthorization).not.to.be.null;
                        newUnit = res.body;
                        done();
                    });
            });

            it('-> Atualizando unidade', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/updateUnit')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        userId: ObjectId("5697face19d3c9021d774490"),
                        unit: {
                            address: {
                                street: "Ápice",
                                number: "321",
                                complement: "",
                                neighborhood: "Centro",
                                city: "Vitória",
                                state: "Espírito Santo",
                                country: "Brasil",
                                postalCode: "06543210",
                                enabled: true
                            }
                        }
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        expect(res.status).to.equal(201);
                        expect(res.body).to.be.an('object').and.to.have.property("_id");
                        expect(res.body._id).not.to.be.null;
                        expect(res.body).to.have.property("nome");
                        expect(res.body.nome).not.to.be.null;
                        expect(res.body).to.have.property("address");
                        expect(res.body.address).to.be.an('array').and.to.have.property("street");
                        expect(res.body.address.street).not.to.be.null;
                        expect(res.body.address).to.have.property("number");
                        expect(res.body.address.number).not.to.be.null;
                        expect(res.body.address).to.have.property("complement");
                        expect(res.body.address.complement).not.to.be.null;
                        expect(res.body.address).to.have.property("neighborhood");
                        expect(res.body.address.neighborhood).not.to.be.null;
                        expect(res.body.address).to.have.property("city");
                        expect(res.body.address.city).not.to.be.null;
                        expect(res.body.address).to.have.property("state");
                        expect(res.body.address.state).not.to.be.null;
                        expect(res.body.address).to.have.property("country");
                        expect(res.body.address.country).not.to.be.null;
                        expect(res.body.address).to.have.property("postalCode");
                        expect(res.body.address.postalCode).not.to.be.null;
                        expect(res.body.address).to.have.property("enabled");
                        expect(res.body.address.enabled).not.to.be.null;
                        expect(res.body).to.have.property("cnpj");
                        expect(res.body.cnpj).not.to.be.null;
                        expect(res.body).to.have.property("alias");
                        expect(res.body.alias).not.to.be.null;
                        expect(res.body).to.have.property("phone");
                        expect(res.body.phone).not.to.be.null;
                        expect(res.body).to.have.property("website");
                        expect(res.body.website).not.to.be.null;
                        expect(res.body).to.have.property("director");
                        expect(res.body.director).not.to.be.null;
                        expect(res.body).to.have.property("directorAuthorization");
                        expect(res.body.directorAuthorization).not.to.be.null;
                        expect(res.body).to.have.property("secretary");
                        expect(res.body.secretary).not.to.be.null;
                        expect(res.body).to.have.property("secretaryAuthorization");
                        expect(res.body.secretaryAuthorization).not.to.be.null;
                        newUnit = res.body;
                        done();
                    });
            });
        });
    });
})();