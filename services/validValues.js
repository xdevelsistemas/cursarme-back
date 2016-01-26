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
     */
    let validValues = (obj) => {
        // TODO verificar casos como campo não obrigatório e array vazio.
        _.values(obj).forEach((el) => {
            if ((typeof el === "object") && !Array.isArray(el)) {
                return valid ? valid && validValues(el) : valid;
            }
            return !!el;
        });
    };

    module.exports = {validValues};
})();