//
(() => {
    'use strict';

    const dbURI    = process.env.DB_URI_TEST;
    const mongoose = require('mongoose');
    const expect = require('chai').expect;


    describe('STUDENT test', () => {
        let newStudent = {};
        const Student = require('../controllers/studentController')();
        let req = { authInfo: {scope: 'ieses'}, user: {_id: "5697face19d3c9021d774497"} };
        let res = {
            statusCode: 0,
            body: [],
            status(s) {this.statusCode = s; return this},
            json(s) {this.body = s; return this}
        };


        beforeEach((done) => {
            if (mongoose.connection.db) return done();
            mongoose.connect(dbURI, done);
        });


        describe('-> GET Students', () => {
            it('-> Buscando todos os estudantes', () => {
                // note o return
                return Student.all(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 200);
                });
            });
        });


        describe('-> ADD Students', () => {
            it('-> Adicionando estudante', () => {
                req.body = {
                    name: "Estudante teste",
                    address: { street: "Vale", number: "123", complement: "", neighborhood: "Santo Antônio", city: "Vitória", state: "Espírito Santo", country: "Brasil", postalCode: "01234560", enabled: true },
                    cnpj: "36625217000135",
                    alias: "Teste",
                    phone: "99999999999",
                    website: "www.x.yyy.zz",
                    director: "5697face19d3c9021d774496",
                    directorAuthorization: "0123456789",
                    secretary: "5697face19d3c9021d774497",
                    secretaryAuthorization: "0123456789"
                };

                // note o return
                return Student.add(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 201);
                });
            });
        });


        describe('-> UPDATE Students', () => {
            it('-> Atualizando um estudate', () => {
                req.body = {
                    _id: "56a7f65448e4662660c51bf0",
                    name: "Estudante teste - teste de update"
                };

                // note o return
                return Student.update(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 200);
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