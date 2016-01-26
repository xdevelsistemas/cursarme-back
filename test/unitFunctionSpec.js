//
(() => {
    'use strict';

    const dbURI    = process.env.DB_URI_TEST;
    const mongoose = require('mongoose');
    const expect = require('chai').expect;


    describe('UNIT test', () => {
        let newUnit = {};
        const Unit = require('../controllers/unitController')();
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



        describe('-> GET Units', () => {
            it('-> Buscando todas as unidades', () => {
                // note o return
                return Unit.all(req, res).then(() => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.be.an('array');
                    if (res.body.length !== 0) {
                        expect(res.body[0]).to.have.property("_id");
                        expect(res.body[0]._id).to.not.equal(null);
                        expect(res.body[0]).to.have.property("name");
                        expect(res.body[0].name).to.not.equal(null);
                    }
                });
            });
        });

        describe('-> POST Units', () => {
            it('-> Adicionando unidade', () => {
                req.body = {name: "Unidade teste unitário 2", address: { street: "Vale", number: "123", complement: "1", neighborhood: "Santo Antônio", city: "Vitória", state: "Espírito Santo", country: "Brasil", postalCode: "01234560", enabled: true }, cnpj: "36625217000135", alias: "Teste", phone: "99999999999", website: "www.x.yyy.zz", director: "5697face19d3c9021d774496", directorAuthorization: "0123456789", secretary: "5697face19d3c9021d774497", secretaryAuthorization: "0123456789" };
                // note o return
                return Unit.add(req, res).then(() => {
                    expect(res.statusCode).to.equal(201);
                    //expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property("_id");
                    expect(res.body._id).to.not.equal(null);
                    expect(res.body).to.have.property("name");
                    expect(res.body.name).to.equal(req.body.name);
                });
            });
        });
    });
})();