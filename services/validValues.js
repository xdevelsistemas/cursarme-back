/**
 * Created by douglas on 13/10/15.
 */
(() => {
    const _ = require("lodash");

    /**
     * Validando os values das keys de obj
     * @param obj
     */
    let validValues = (obj) => {
        _.values(obj).forEach((el) => ((typeof el === "object") && !Array.isArray(el)) ? validValues(el) : !!el);
    };

    module.exports = {validFields};
})();