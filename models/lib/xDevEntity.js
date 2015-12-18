/**
 * Created by clayton on 11/12/15.
 */
/**
 * extendendo o objeto antes de persistir com dados padrões
 * @param obj objeto que vai realizar a persistencia
 * @param userId usuario
 * @param op operacao
 */

var ops =  {
    INSERT : 1,
    UPDATE : 2,
    DELETE : 3
};


util.inherits(BaseSchema, Schema);


function extend (obj,userId,op,geralog) {

    if (!obj.user_created && op === ops.INSERT){
        obj.user_created = userId;
        obj.date_created = new Date();
    }

    if (!obj.user_updated && op === ops.UPDATE ){
        obj.user_updated = userId;
        obj.date_updated = new Date();
    }


    if (geralog){

    }


    return obj;

}

