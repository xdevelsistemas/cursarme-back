/**
 * Created by douglas on 29/01/16.
 */

(() => {
    "use strict";

    const dbURI = process.env.DB_URI_TEST;
    const mongoose = require('mongoose');

    beforeEach((done) => {
        if (mongoose.connection.db) return done();
        mongoose.connect(dbURI, done);
    });

    afterEach((done) => {
        mongoose.disconnect();
        done();
    });
})();