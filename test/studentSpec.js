(() => {
    'use strict';

    const supertest = require('supertest');
    const expect = require('chai').expect;
    const app = require('../app');

    describe('STUDENT test : endpoint', () => {
        let newStudent = {};

        describe('-> Unauthorized', () => {
            it('-> Requisição não autorizada', (done) => {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/students')
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

        describe('-> GET Student', function () {
            it('-> Buscando todos os estudantes', function (done) {
                this.timeout(60000);
                supertest(app).get('/api/v1.1/students')
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

        describe('-> ADD Student', function () {
            it('-> Adicionando estudante', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/addStudent')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
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
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        _verifyFields(res.body, res.status, 201);
                        newStudent = res.body;
                        done();
                    });
            });

            it('-> Atualizando estudante', function (done) {
                this.timeout(60000);
                supertest(app).post('/api/v1.1/updateStudent')
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
                        newStudent = res.body;
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
        expect(data).to.have.property("matNumber").and.not.to.be.null;
        expect(data).to.have.property("name").and.not.to.be.null;
        expect(data).to.have.property("address").and.to.be.an('object');
        expect(data.address).to.have.property("street").and.not.to.be.null;
        expect(data.address).to.have.property("number").and.not.to.be.null;
        expect(data.address).to.have.property("complement").and.not.to.be.null;
        expect(data.address).to.have.property("neighborhood").and.not.to.be.null;
        expect(data.address).to.have.property("city").and.not.to.be.null;
        expect(data.address).to.have.property("state").and.not.to.be.null;
        expect(data.address).to.have.property("country").and.not.to.be.null;
        expect(data.address).to.have.property("postalCode").and.not.to.be.null;
        expect(data.address).to.have.property("enabled").and.not.to.be.null;
        expect(data).to.have.property("birthDate").and.not.to.be.null;
        expect(data).to.have.property("cpf").and.not.to.be.null;
        expect(data).to.have.property("rg").and.not.to.be.null;
        expect(data).to.have.property("user").and.not.to.be.null;
        expect(data).to.have.property("maritalStatus").and.not.to.be.null;
        expect(data).to.have.property("gender").and.not.to.be.null;
        expect(data).to.have.property("ethnicity").and.not.to.be.null;
        expect(data).to.have.property("phones").and.to.be.an('array');
        if(data.phones.length > 0) {
            expect(data.phones[0]).to.have.property("description").and.not.to.be.null;
            expect(data.phones[0]).to.have.property("phone").and.not.to.be.null;
        }
        expect(data).to.have.property("contacts").and.to.be.an('array');
        if(data.contacts.length > 0) {
            expect(data.contacts[0]).to.have.property("name").and.not.to.be.null;
            expect(data.contacts[0]).to.have.property("phone").and.not.to.be.null;
        }
        expect(data).to.have.property("documents").and.to.be.an('array');
        if(data.documents.length > 0) {
            expect(data.documents[0]).to.have.property("description").and.not.to.be.null;
            expect(data.documents[0]).to.have.property("imageUrl").and.not.to.be.null;
        }
    }
})();