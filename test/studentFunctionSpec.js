//
(() => {
    'use strict';

    const expect = require('chai').expect;
    const configSpec = require('../test/configTest');


    describe('STUDENT test', () => {
        let newStudent = {};
        const Student = require('../controllers/studentController')();

        // req e res simulando as funções de endpoints
        let req = { authInfo: {scope: 'ieses'}, user: {_id: "5697face19d3c9021d774497"} };
        let res = {
            statusCode: 0,
            body: [],
            status(s) {this.statusCode = s; return this},
            json(s) {this.body = s; return this}
        };


        describe('-> GET Students', () => {
            it('-> Buscando todos os alunos', () => {
                // note o return
                return Student.all(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 200);
                });
            });
        });


        describe('-> ADD Students', () => {
            it('-> Adicionando aluno', () => {
                req.body = {
                    matNumber: "20161BSI0001",
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
                        phone : "2799999999"
                    }],
                    user: "5697face19d3c9021d774496",
                    maritalStatus: "single",
                    gender: "male",
                    ethnicity: "brown",
                    contacts : [{ name : "Maria", phone : "2799999999" }],
                    documents: [{ description : "Comprovante de residência", imageUrl : "www.x.yyy.zz/imageDoc/1" }]
                };

                // note o return
                return Student.add(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 201);
                    newStudent = res.body;
                });
            });
        });


        describe('-> UPDATE Students', () => {
            it('-> Atualizando um estudate', () => {
                req.body = {
                    _id: newStudent._id,
                    name: "Aluno teste - teste de update"
                };

                // note o return
                return Student.update(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 200);
                    newStudent = res.body;
                });
            });
        });


        describe('DELETE Student', () => {
            it('-> Removendo aluno', (done) => {
                req.body = {
                    _id: newStudent._id
                };

                // note o return
                return Student.delete(req, res).then(() => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property("success").and.to.be.true;
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