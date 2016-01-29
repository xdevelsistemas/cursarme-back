//
(() => {
    'use strict';

    const expect = require('chai').expect;
    const configSpec = require('configTest');


    describe('UNIT test', () => {
        let newUnit = {};
        const Unit = require('../controllers/unitController')();

        // req e res simulando as funções de endpoints
        let req = { authInfo: {scope: 'ieses'}, user: {_id: "5697face19d3c9021d774497"} };
        let res = {
            statusCode: 0,
            body: [],
            status(s) {this.statusCode = s; return this},
            json(s) {this.body = s; return this}
        };


        describe('-> GET Units', () => {
            it('-> Buscando todas as unidades', () => {
                // note o return
                return Unit.all(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 200);
                });
            });
        });


        describe('-> ADD Units', () => {
            it('-> Adicionando unidade', () => {
                req.body = {
                    name: "Unidade teste",
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
                return Unit.add(req, res).then(() => {
                    _verifyFields(res.body, res.statusCode, 201);
                });
            });
        });


        describe('-> UPDATE Units', () => {
            it('-> Atualizando uma unidade', () => {
                req.body = {
                    _id: "56a7f65448e4662660c51bf0",
                    name: "Unidade teste unitário - teste de update"
                };

                // note o return
                return Unit.update(req, res).then(() => {
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