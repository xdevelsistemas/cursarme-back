(() => {
    'use strict';

    const supertest = require('supertest');
    const expect = require('chai').expect;
    const app = require('../app');

    describe('EMPLOYEE test : endpoint', () => {
        let newEmployee = {};

        describe('-> Unauthorized', () => {
            it('-> Requisição não autorizada', (done) => {
                supertest(app).get('/api/v1/employees')
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

        describe('-> GET Employees', function () {
            it('-> Buscando todos os funcionários', function (done) {
                supertest(app).get('/api/v1/employees')
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

        describe('-> ADD Employee', function () {
            it('-> Adicionando funcionários', function (done) {
                supertest(app).post('/api/v1/addEmployee')
                    .set('authorization', 'Bearer ' + process.env.API_TOKEN)
                    .set('Accept', 'application/json')
                    .send({
                        admin: false,
                        enabled: true,
                        position: "Auxiliar administrativo",
                        titration: "Nível médio",
                        perms: [{
                            unit: "56a7f65448e4662660c51bf0",
                            modules: ["sales"]
                        }],
                        name: "João das Couves",
                        address: [{
                            street: "Vale",
                            number: "123",
                            complement: "",
                            neighborhood: "Santo Antônio",
                            city: "Vitória",
                            state: "Espírito Santo",
                            country: "Brasil",
                            postalCode: "01234560",
                            enabled: true
                        }],
                        birthDate: 764996400000,
                        cpf: "01234567890",
                        phones: [{
                            description : "Home",
                            phone : "2733221100"
                        }],
                        user: "5697face19d3c9021d774496",
                        maritalStatus: "single",
                        gender: "male",
                        ethnicity: "brown",
                        contacts : [{
                            name : "Home",
                            phone : "2744332211"
                        }],
                        documents: [{
                            description : "Comprovante de residência",
                            imageUrl : "www.x.yyy.zz/imageDoc/1"
                        }]
                    })
                    .expect('Content-Type', /json/)
                    .end(function (err, res) {
                        if (!!err) return done(err);
                        expect(err).to.equal(null);
                        _verifyFields(res.body, res.status, 201);
                        newEmployee = res.body;
                        done();
                    });
            });
        });


        describe('-> UPDATE Employee', function () {
            it('-> Atualizando funcionário', function (done) {
                supertest(app).post('/api/v1/updateEmployee')
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
                        newEmployee = res.body;
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
        expect(data).to.have.property("admin").and.not.to.be.null;
        expect(data).to.have.property("enabled").and.not.to.be.null;
        expect(data).to.have.property("position").and.not.to.be.null;
        expect(data).to.have.property("titration").and.not.to.be.null;
        expect(data).to.have.property("perms").and.to.be.an('array');
        expect(data.perms[0]).to.have.property("unit").and.not.to.be.null;
        expect(data.perms[0]).to.have.property("modules").and.to.be.an('array');
        expect(data.perms[0].modules[0]).not.to.be.null;
        expect(data).to.have.property("name").and.not.to.be.null;
        expect(data).to.have.property("address").and.to.be.an('array');
        expect(data.address[0]).to.have.property("street").and.not.to.be.null;
        expect(data.address[0]).to.have.property("number").and.not.to.be.null;
        expect(data.address[0]).to.have.property("complement").and.not.to.be.null;
        expect(data.address[0]).to.have.property("neighborhood").and.not.to.be.null;
        expect(data.address[0]).to.have.property("city").and.not.to.be.null;
        expect(data.address[0]).to.have.property("state").and.not.to.be.null;
        expect(data.address[0]).to.have.property("country").and.not.to.be.null;
        expect(data.address[0]).to.have.property("postalCode").and.not.to.be.null;
        expect(data.address[0]).to.have.property("enabled").and.not.to.be.null;
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