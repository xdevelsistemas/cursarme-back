// route middleware to make sure a user is logged in
function autentica(passport) {
    //necessário obter o user
    return passport.authenticate('bearer', { session: false });
}

module.exports = autentica;