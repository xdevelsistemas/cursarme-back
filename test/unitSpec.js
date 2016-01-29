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

        describe('-> GET Unit', () => {
            it('-> Buscando todos as unidades', (done) => {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/units')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        _verifyFields(res.body, res.status, 200);
                        done();
                    });
            });
        });

        describe('-> ADD Unit', () => {
            it('-> Adicionando unidade', (done) => {
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
                        _verifyFields(res.body, res.status, 201);
                        newUnit = res.body;
                        done();
                    });
            });
        });

        describe('UPDATE Unit', () => {
            it('-> Atualizando unidade', (done) => {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/updateUnit')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
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
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        _verifyFields(res.body, res.status, 200);
                        newUnit = res.body;
                        done();
                    });
            });
        });
    });


    /**
     * Verifica se os campos estão corretos
     * @param data
     * @param statusCode
     * @param status
     * @private
     */
    let _verifyFields = (data, statusCode, status) => {
        let type;

        if (Array.isArray(data)) {
            type = 'array';
            if (data.length === 0) return;
            data = data[0];
        } else {
            type = 'object';
        }
        expect(statusCode).to.equal(status);
        expect(data).to.be.an(type);
        expect(data).to.have.property("_id").and.not.to.be.null;
        expect(data).to.have.property("name").and.not.to.be.null;
        expect(data).to.have.property("address").and.to.be.an('object');
        expect(data.address).and.to.have.property("street").and.not.to.be.null;
        expect(data.address).to.have.property("number").and.not.to.be.null;
        expect(data.address).to.have.property("complement").and.not.to.be.null;
        expect(data.address).to.have.property("neighborhood").and.not.to.be.null;
        expect(data.address).to.have.property("city").and.not.to.be.null;
        expect(data.address).to.have.property("state").and.not.to.be.null;
        expect(data.address).to.have.property("country").and.not.to.be.null;
        expect(data.address).to.have.property("postalCode").and.not.to.be.null;
        expect(data.address).to.have.property("enabled").and.not.to.be.null;
        expect(data).to.have.property("cnpj").and.not.to.be.null;
        expect(data).to.have.property("alias").and.not.to.be.null;
        expect(data).to.have.property("phone").and.not.to.be.null;
        expect(data).to.have.property("website").and.not.to.be.null;
        expect(data).to.have.property("director").and.not.to.be.null;
        expect(data).to.have.property("directorAuthorization").and.not.to.be.null;
        expect(data).to.have.property("secretary").and.not.to.be.null;
        expect(data).to.have.property("secretaryAuthorization").and.not.to.be.null;
    }
})();