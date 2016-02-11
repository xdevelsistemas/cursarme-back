
module.exports = () => {
    "use strict";

    let studentController = {};
    const MongooseErr = require('../services/MongooseErr');
    const getClient = require('../services/getClient');
    const StudentModel = require('../models/multitenant/student');
    const ValidValues = require("../services/validValues");

    /**
     * lista todas os alunos
     * @param req
     * @param res
     */
    studentController.all = (req, res) => {
        return StudentModel(getClient(req)).all()
            .then((data) => {
                return res.status(200).json(data);
            })
            .catch((err) => MongooseErr.apiGetMongooseErr(err,res));
    };

    /**
     * Adiciona um aluno
     * @param req
     * @param res
     */
    studentController.add = (req, res) => {
        // validando os dados da unidade em req.body
        /*if (!ValidValues.validValues(req.body, ["complement"])) {
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
     * Atualiza um aluno
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

    /**
     * Remove um aluno
     * @param req
     * @param res
     * @returns {Promise.<T>}
     */
    studentController.delete = (req, res) => {
        return StudentModel(getClient(req)).delete(req.user._id, true, 'Test', req.body)
            .then(() => {
                return res.status(200).json({success : true});
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            })
    };


    /**
     * Verifica a situação do aluno com a instituição
     * @param cpf
     * @returns {{status: boolean}}
     */
    studentController.verifCpf = (cpf) => {
        return StudentModel(getClient(req)).verifCpf(cpf)
            .then((data) => {
                // TOdo verificar estrutura e campos para os dados de retorno
                return {status: data.status};
            })
            .catch((err) => {
                return MongooseErr.apiGetMongooseErr(err, res);
            });
    };


    return studentController;
};
