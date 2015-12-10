rp = require("request-promise");
confAdmin = require("../models/conf-admin");
var parseString = require('xml2js').parseString;


var  makeUri = function(apiKey,objectKey, url){
    uri = 'http://sandbox.buscape.com.br/service/createLinks/lomadee/' + apiKey +  '/BR/?sourceId=' + objectKey + '&link1=' + url;
};

var fun =  function (url,apiKey,objectKey) {

    if(apiKey && objectKey){
        var  uri = makeUri(apiKey,objectKey,url);
        var options = {
            uri: uri
        };
        return rp(options)
            .then(function(response){
                if (response){
                    var val = "";

                    parseString(response,function(err,result){
                        if (!err){
                            val =  result.Result.lomadeeLinks[0].lomadeeLink[0].redirectLink[0];
                        }else{
                            val =  null;
                        }
                    });

                    return val;
                } else { return null;}
            })
            .catch(function(err){
                console.log(err);
                throw new error(err);
            });
    }else{
        return  confAdmin.getConf()
            .then(function(data){

                if (data){
                    // sample
                    // http://sandbox.buscape.com.br/service/createLinks/lomadee/4a3039424c7656367363673d/BR/?sourceId=33093174&link1=http://www.submarino.com.br/produto/7127531/livro-querido-john
                    var  uri = makeUri(data.chave_api,data.chave_referencia,url);
                    var options = {
                        uri: uri
                    };
                    return rp(options);
                }else {
                    return null;
                }
            }).then(function(response){
                if (response){
                    var val = "";

                    parseString(response,function(err,result){
                        if (!err){
                            val =  result.Result.lomadeeLinks[0].lomadeeLink[0].redirectLink[0];
                        }else{
                            val =  null;
                        }
                    });

                    return val;
                } else { return null;}
            })
            .catch(function(err){
                console.log(err);
                throw new error(err);
            });
    }


};




module.exports = fun;