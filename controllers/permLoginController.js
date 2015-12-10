/**
 * Created by clayton on 21/08/15.
 */
var  permLogingModel = require('../models/permLogin');
var  MongooseErr = require('../services/MongooseErr');

module.exports = function() {
    var permLoginController = {};

    /**
     * verifica se usuário pode ter acesso ao admin
     * @param req
     * @param res
     */
    permLoginController.valid = function(req, res) {
        var email = req.params.email;

        if (email){
            permLogingModel.validPerm(email)
                .then(function(data){
                    if (data){
                        return res.json({success : true });
                    }else{
                        return MongooseErr.apiCallErr("usuário sem permissão",res,401);
                    }
            }).catch(function(err){
                    return MongooseErr.apiCallErr(err,res,500);
            });
        }else {
            return MongooseErr.apiCallErr("usuário sem permissão",res,401);
        }
    };
    return permLoginController;
};
