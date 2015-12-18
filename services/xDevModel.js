/**
 * Created by clayton on 16/12/15.
 */

module.exports = callModule;

function callModule(mongoose){
    "use strict";
    let  funcs = {};

    funcs.model = function(client,model,schema){
        let ret;
        try {
            ret = mongoose.model(client + '.' +  model);
        }catch(e) {
            ret = mongoose.model(client + '.' +  model, schema);
        }
        return ret;
    };

    return funcs;

}