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
        _.values(obj).forEach((el) => {
            if ((typeof el === "object") && !Array.isArray(el)) {
                return valid ? valid && validValues(el) : valid;
            } else {
                return !!el
            }
        });
    };

    module.exports = {validValues};
})();