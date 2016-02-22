/**
 * Created by douglas on 13/10/15.
 */
(() => {
    "use strict";

    let isValid = false;
    const _ = require("lodash");

    /**
     * Validando os campos que a entidade endereço possui
     * @param data Dados dos endereços
     */
    let validAddress = (data) => {
        if (Array.isArray(data)) {
            isValid = true;
            data.forEach((el) => {
                isValid = isValid && !!el.street && !!el.number
                    && !!el.neighborhood && !!el.city && !!el.state
                    && !!el.country && !!el.postalCode && !!el.enabled
            });
        } else {
            isValid = isValid && !!data.street && !!data.number
                && !!data.neighborhood && !!data.city && !!data.state
                && !!data.country && !!data.postalCode && !!data.enabled
        }

        return isValid;
    };

    module.exports = {validAddress};
})();