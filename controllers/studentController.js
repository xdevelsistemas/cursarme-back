
module.exports = () => {
    "use strict";

    let studentController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const StudentModel = require('../models/multitenant/student');
    const ValidValues = require("../services/validValues");

    /**
     * lista todas os estudantes
     * @param req
     * @param res
     */
    studentController.all = (req, res) => {
        return StudentModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((erro) => MongooseErr.apiGetMongooseErr(erro,res));
    };

    /**
     * Adiciona um estudante
     * @param req
     * @param res
     */
    studentController.add = (req, res) => {
        // validando os dados da unidade em req.body
        /*if (!ValidValues.validValues(req.body)) {
            return MongooseErr.apiCallErr("Dados inválidos", res, 400);
        }*/

        return StudentModel(getClient(req)).add(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(201).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };

    /**
     * Atualiza um estudante
     * @param req
     * @param res
     */
    studentController.update = (req, res) => {

        // validando os dados da unidade em req.body
        /*if (!ValidValues.validValues(req.body)) {
         return MongooseErr.apiCallErr("Dados inválidos", res, 400);
         }*/

        return StudentModel(getClient(req)).update(req.user._id, true, 'Test', req.body)
            .then((data) => {

                return res.status(200).json(data);
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };



    return studentController;
};