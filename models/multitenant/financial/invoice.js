/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    /* todo falta
        - ligar com cheque
        - criar caixa financeiro e ligar
        - colocar configuracoes do iugu no caixa?
        - analisar pagamentos em dinheiro
        - analisar pagamento em cheque
        - anexar comprovantes em caso de problema?
     */


    let mongoose = require('mongoose');
    let Schema = mongoose.Schema;
    let extend = require('mongoose-schema-extend');
    const xDevSchema = require("../../lib/xDevEntity").xDevSchema;
    const xDevModel = require("../../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../../config/mongooseRedisCache");
    const MongooseErr = require("../../../services/MongooseErr");
    const _ = require('lodash');
    const PersonSchema = require("../../person");
    const invoicePaymentType = require("../../enum/invoicePaymentType");
    const invoiceStatus = require("../../enum/invoiceStatus");



    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');



    /**
     * model Schema
     */

    /*
     objetivo:  obter status do iugu dos boletos
     */
    let IuguSchema = new Schema({

    });


    let ItemInvoiceSchema = new Schema({
        /* Descrição do Item */
        description	: {type: String, required: true},
        quantity: {type: Number, required: true , default: 1},
        /*Preço em Centavos. Valores negativos entram como desconto no total da Fatura */
        price_cents: {type: Number, required: true }
    });




    let InvoiceSchema = xDevSchema.extend({
        unit: {type: Schema.Types.ObjectId, ref: xDevModel.ref(client,'Unit')},
        student: {type: Schema.Types.ObjectId, ref: xDevModel.ref(client,'Student')},
        enroll: {type: Schema.Types.ObjectId, ref: xDevModel.ref(client,'Enroll')},
        contract: {type: String, required: true},
        plan: {type: Schema.Types.ObjectId, ref: xDevModel.ref(client,'Plan')},
        iugu: {type: IuguSchema, required: true},
        /**
         * campos herdados do iugu
         *
         * /

         /*E-Mail do cliente*/
        email: {type: String, required: true },
        /*Data de Expiração (DD/MM/AAAA)*/
        /**
         * validade da invoice = sempre 60 dias apos o vencimento por padrao
         */
        due_date: {type: Date, required: true},
        /*Itens da Fatura*/
        items: [ItemInvoiceSchema],
        /*Cliente é redirecionado para essa URL após efetuar o pagamento da Fatura pela página de Fatura da Iugu*/
        return_url: {type: String, required: true },
        /* Cliente é redirecionado para essa URL se a Fatura que estiver acessando estiver expirada */
        expired_url: {type: String, required: true },
        /* chamada para todas as notificações de Fatura, assim como os webhooks (Gatilhos) são chamados */
        notification_url: {type: String, required: true },
        /* Valor dos Impostos em centavos */
        tax_cents: {type: Number, required: true },
        /* Booleano para Habilitar ou Desabilitar multa por atraso de pagamento */
        fines : {type: Boolean, required: true, default: true},
        /* Determine a multa a ser cobrada para pagamentos efetuados após a data de vencimento */
        /* o valor deve vir da configuração do cliente */
        late_payment_fine: { type: Number , require: true },
        /* Booleano que determina se cobra ou não juros por dia de atraso. 1% ao mês pro rata. */
        per_day_interest :  {type: Boolean, required: true, default: true},
        /* Valor dos Descontos em centavos */
        discount_cents: {type: Number, required: true , default: 0 },
        /* ID do Cliente - possivelmente ignorado pois teremos nosso controle */
        customer_id: {type: String, required: false },
        /* Booleano que ignora o envio do e-mail de cobrança */
        ignore_due_email: {type: Boolean, required: true, default: false},
        /* Método de pagamento que será disponibilizado para esta Fatura (‘all’, ‘credit_card’ ou ‘bank_slip’). Obs: Caso esta Fatura esteja atrelada à uma Assinatura, a prioridade é herdar o valor atribuído na Assinatura; caso esta esteja atribuído o valor ‘all’, o sistema considerará o payable_with da Fatura; se não, o sistema considerará o payable_with da Assinatura. */
        payable_with: { type: String , required: true , array: invoicePaymentType.options , default: 'bank_slip' },
        /* Caso tenha o subscription_id, pode-se enviar o número de créditos a adicionar nessa Assinatura quando a Fatura for paga */
        credits: { type: Number , required: false , default: 0 },
        /*
         Controle
         */
        iuguStatus: { type: String , required: true, default : 'pending'},
        cursarmeStatus: { type: String , array: invoiceStatus.options, required: true , default: 'active'}
    });


    /**
     * enabling caching
     */
    InvoiceSchema.set('redisCache', true);


    InvoiceSchema.methods.add = (userId,useLog) => {
        return xDevSchema.prototype.add(this,userId,useLog);
    };

    InvoiceSchema.methods.update = (userId,useLog) => {
        return xDevSchema.prototype.update(this,userId,useLog);
    };



    return xDevModel.model(client,'Enroll',InvoiceSchema);
}





