/**
 * Created by douglas on 13/10/15.
 */

var extend = require("extend");


/**
 * função utilizada para gerar mensagem genérica
 * @param msg mensagem personalizada
 * @param res retorno para o rest api
 * @param statusCode codigo do erro, se vazio assume codigo 500
 * @returns {*}
 */

var apiCallErr = function (msg,res,statusCode){
    console.log(msg);
    return res.status(statusCode?statusCode:500).json({"msg": msg});
};


/**
 * valida o erro dentro do tratamento do mongoose, se não for erro do mongoose, será enviado a estrutura padrao de erro
 * @param error classe instanciada do erro
 * @param res retorno
 * @param statusCode codigo do erro a ser suprido em caso de erro
 * @returns {*} retorno é o res restornando na api
 */
var  apiGetMongooseErr = function (error,res,statusCode){
    var msgerr = {};


    if (!!error.error || !!error.name) {
        var  localErr =  function(){
            if (!!error.error){
                return error.error;
            }else{
                return error;
            }
        }();
        switch (localErr.name) {
            case 'ValidationError':
                msgerr = {err : "Erro de validação de dados"};
                fieldErr = [];
                for (var tpField in localErr.errors) {
                    switch (localErr.errors[tpField].kind) {
                        case 'required':
                            fieldErr.push({ field : tpField , err : 'campo "' + tpField + '" é obrigatório'});
                            break;
                        case 'invalid':
                            fieldErr.push({ field : tpField , err : 'campo "' + tpField + '" é inválido'});
                            break;
                    }
                }
                extend(true, msgerr, {fields : fieldErr});
                break;
            case 'CastError':
                msgerr = {err: localErr.message, msg: "Id inválido"};
                break;
            default:
                msgerr = localErr.errors;
        }

    }
    console.log(error);
    /**
     * ordem de prioridade :
     * 1 - erro imposto
     * 2 - erro de validacao
     * 3 - fixa erro 500 em caso do 1) e 2) nao acontecer
     */
    return res.status(statusCode?statusCode:(!!error.statusCode?error.statusCode:500)).json((!!error.error || !!error.name)?msgerr:{err : error.message, fields : []});
};

module.exports = {
    apiGetMongooseErr: apiGetMongooseErr ,
    apiCallErr: apiCallErr

};
