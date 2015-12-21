/**
 * Created by clayton on 16/12/15.
 */

module.exports = callModule;

function callModule(mongoose){
    "use strict";
    let  funcs = {};

    let concat = (a,b) =>  a + '.' + b;

    funcs.model = (client,model,schema) => {
        let ret;
        try {
            ret = mongoose.model(concat(client,model));
        }catch(e) {
            ret = mongoose.model(concat(client,model), schema);
        }
        return ret;
    };

    funcs.ref = (client,model,schema) => {
        return concat(client,model);
    };

    return funcs;

}