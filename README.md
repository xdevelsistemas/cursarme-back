# cursarme-back
Projeto Cursar.me backend feito em nodejs


Ele foi projetado em nodejs para rodar na versão 4.2 onde possui:

- Mongodb multitenant como base de dados para multiplos clientes
- Construído com lógica assincrona e bom uso da programação funcional utilizando o ES6
- bom uso e lodash e lodash-fp e bluebird para gerenciamento de promises.


- Os nomes de metodos e campos devem ser feitos totalmente em ingles como modelo de padrão a ser utilizado

- Entidades para usar de modelo:
    - model/unit (model)
    - controller/unit (controller)
    - routes/unit (route)
    
- é obrigatório a documentação do projeto nos arquivos de rotas

variáveis de ambientes para rodar a aplicação:

* os valores foram colocados para rodar em ambiente local e serve somente como exemplo

    - MONGO_URL=mongodb://localhost/cursarme
    - REDIS_HOST=localhost
    - REDIS_PORT=6379
    - REDIS_DB=4
    - STATIC_HOST=*
    - CHAOS_MONKEY=1
    - NODE_ENV=development
    - AWS_S3_KEY=XXXX
    - AWS_S3_SECRET=YYYY
    - AWS_S3_REGION=sa-east-1
    - AWS_S3_BUCKET=cursarmeresources
    - AWS_SES_KEY=XXXX
    - AWS_SES_SECRET=YYYY
    - AWS_SES_REGION=sa-east-1
    - DATADOG_API_KEY=ZZZZ
    - NEW_RELIC_LICENSE_KEY=WWWW
    - NEW_RELIC_APP_NAME=api.cursar.me
    

