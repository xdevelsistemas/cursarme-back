module.exports = function (app, passport) {

    var homeController = require('../controllers/homeController')(passport);

    //home path
    // INDEX SECTION =====================
    app.get('/',homeController.index);

    app.get('/loaderio-9f255e34333ed48ef6e733bd771bd91f', function(req,res,next){
        res.send('loaderio-9f255e34333ed48ef6e733bd771bd91f');
    } );

    return app;
};





