//
(() => {
    'use strict';

    const dbURI    = 'mongodb://localhost/desenv';
    const mongoose = require('mongoose');
    const expect = require('chai').expect;


    describe('UNIT test', () => {
        let newUnit = {};
        const Unit = require('../controllers/unitController')();
        let req = { authInfo: {scope: 'unit'} };
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
                Unit.all(req, res);
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.be.an('array');
                /*if (res.body.length !== 0) {
                    expect(res.body[0]).to.have.property("_id");
                    expect(res.body[0]._id).to.not.equal(null);
                    expect(res.body[0]).to.have.property("nome");
                    expect(res.body[0].nome).to.not.equal(null);
                }*/
            });
        });

        /*describe('-> POST Units', () => {
            it('-> Adicionando unidade', () => {
                Unit.add(req, res);
                expect(res.statusCode).to.equal(201);
                expect(res.body).to.be.an('array');
                /!*if (res.body.length !== 0) {
                    expect(res.body[0]).to.have.property("_id");
                    expect(res.body[0]._id).to.not.equal(null);
                    expect(res.body[0]).to.have.property("nome");
                    expect(res.body[0].nome).to.not.equal(null);
                }*!/
            });
        });*/
    });
})();