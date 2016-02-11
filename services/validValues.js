/**
 * Created by douglas on 13/10/15.
 */
(() => {
    "use strict";

    let valid = true;
    const _ = require("lodash");

    /**
     * Validando os values das keys de obj
     * @param obj  Objeto a ser verificado
     * @param exception  Lista com os campos que serão ignorados
     */
    let validValues = (obj, exception) => {
        // TODO verificar casos como campo não obrigatório e array vazio.
        _.values(obj).forEach((el) => {
            if ((_.indexOf(exception, el)===-1)) {
                if ((typeof el === "object") && (!Array.isArray(el))) {
                    return valid ? valid && validValues(el, exception) : valid;
                }
                return !!el;
            }
        });
    };

    module.exports = {validValues};
})();