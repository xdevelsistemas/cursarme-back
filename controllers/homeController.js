/**
 * Created by clayton on 21/08/15.
 */
module.exports = function() {
    var homeController = {};

    /**
     * redireciona para a documentacao da api
     * @param req
     * @param res
     */
    homeController.index = function(req, res) {
        return res.redirect('/docs');
    };
    return homeController;
};
