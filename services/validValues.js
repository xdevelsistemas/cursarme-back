/**
 * Created by douglas on 13/10/15.
 */
(() => {
    "use strict";

    const _ = require("lodash");
    let valid = true;

    /**
     * Validando os values das keys de obj
     * @param obj
     * @param exception
     */
    let validValues = (obj, exception) => {
        // TODO verificar casos como campo não obrigatório e array vazio.
        _.values(obj).forEach((el) => {
            if ((typeof el === "object") && (_.indexOf(exception, el)===-1)) {
                if (!Array.isArray(el)) return valid ? valid && validValues(el, exception) : valid;
            } else {

            }
            return !!el;
        });
    };

    module.exports = {validValues};
})();