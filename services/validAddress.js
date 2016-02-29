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
                isValid = isValid && fields(el);
            });
        } else {
            isValid = fields(data);
        }

        return isValid;
    };

    let fields = (obj) => {
        return !!obj.street && !!obj.number && !!obj.neighborhood && !!obj.city && !!obj.state
        && !!obj.country && !!obj.postalCode && !!obj.enabled && !!obj.description;
    };

    module.exports = {validAddress};
})();