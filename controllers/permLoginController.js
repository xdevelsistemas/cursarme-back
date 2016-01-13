/**
 * Created by clayton on 21/08/15.
 */

module.exports = () => {
    "use strict";

    let permLoginController = {};
    const  permLogingModel = require('../models/permLogin');
    const  MongooseErr = require('../services/MongooseErr');


    /**
     * verifica se usuário pode ter acesso ao admin
     * @param req
     * @param res
     */
    permLoginController.valid = (req, res) => {
        let email = req.params.email;

        if (email){
            permLogingModel.validPerm(email)
                .then((data) => {
                    if (data){
                        return res.json({success : true });
                    }else{
                        return MongooseErr.apiCallErr("usuário sem permissão",res,401);
                    }
                })
                .catch((err) => MongooseErr.apiCallErr(err,res,500));
        } else {
            return MongooseErr.apiCallErr("usuário sem permissão",res,401);
        }
    };


    return permLoginController;
};
