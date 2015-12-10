// route middleware to make sure a user is logged in
function autentica(passport) {
    return passport.authenticate('bearer', { session: false })
}

module.exports = autentica;