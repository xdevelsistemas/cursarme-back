/**
 * xdevel sistemas escaláveis - cursarme
 * @type {*|exports|module.exports}
 */
module.exports = callModule;



function callModule(client) {
    "use strict";

    let mongoose = require('mongoose');
    let extend = require('mongoose-schema-extend');
    const extendObj = require('extend');
    const Schema = mongoose.Schema;
    const xDevSchema = require("../multitenant/lib/xDevEntity")(client).xDevSchema;
    const xDevModel = require("../../services/xDevModel")(mongoose);
    const mongooseRedisCache = require("../../config/mongooseRedisCache");
    const MongooseErr = require("../../services/MongooseErr");
    const _ = require('lodash');




    /**
     * padrão - utilizando bluebird como promise
     */
    mongoose.Promise = require('bluebird');

    /**
     * model Schema
     */

    const DocsSchema = new Schema({
        name_docs: { type: String, required: true}
    });

    const PeriodSchema = new Schema({
        year: { type: Number, required: true},
        /**
         * parte do ano - ex. /1, /2
         */
        part: { type: Number, required: true},
        /**
         * periodo letivo - ex. 3(ºperiodo)
         */
        period: { type: Number, required: true}
    });

    const ClassSchema = new Schema({
        name: { type: String, required: true},
        /**
         * turno
         */
        shift: { type: String, required: true},
        description: { type: String, required: true}
    });

    const GradeSchema = new Schema({
        name: { type: String, required: true},
        /**
         * vigência
         */
        effective: { type: String, required: true},
        /**
         * carga horária
         */
        workload: { type: Number, required: true},
        /**
         * carga horária total
         */
        workloadTotal: { type: Number, required: true},

        disciplines: [{ type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Discipline'), required: true }]
    });

    // TOdo verificar se algum outro modelo migrará para cá
    let CourseSchema = xDevSchema.extend({
        name: { type: String, required: true },
        /**
         * habilitação -
         */
        license: { type: String, required: true },
        /**
         * resolução -
         */
        resolution: { type: String, required: true },
        /**
         * autorização -
         */
        authorization: { type: String, required: true },
        /**
         * reconhecimento -
         */
        recognition: { type: String, required: true },
        /**
         * Lista de documentos necessários para a matrícula no curso
         */
        documents: [DocsSchema],
        quorum: { type: Number, required: true},
        /**
         * Tipo do curso
         */
        typeCourse: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'TypeCourse'), required: true },
        /**
         * Area do curso
         */
        area: { type: Schema.Types.ObjectId, ref: xDevModel.ref(client, 'Area'), required: true },
        /**
         * período
         */
        period: PeriodSchema,
        /**
         * turma
         */
        class: ClassSchema,
        /**
         * modalidade
         */
        modality: {type: String, required: true},
        grade: GradeSchema

    });

    /**
     * enabling caching
     */
    CourseSchema.set('redisCache', true);


    /**
     * Busca todos os cursos
     * @returns {*}
     */
    // TODO Converter o bloco de código abaixo para es6
    // mantido código no formato antigo por problemas de escopo com o modelo
    CourseSchema.statics.all = function() { return this.find({})};

    CourseSchema.statics.findById = function(_id) { return this.findOne({_id: _id})};

    /**
     * Adiciona um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.add = function(userId, useLog, entity, data) {
        let course = this();

        course.name = data.name;
        course.license = data.license;
        course.resolution = data.resolution;
        course.authorization = data.authorization;
        course.recognition = data.recognition;
        course.documents = data.documents;
        course.quorum = data.quorum;
        course.typeCourse = data.typeCourse;
        course.area = data.area;
        course.period = data.period;
        course.class = data.class;
        course.modality = data.modality;
        course.grade = data.grade;

        return xDevSchema._add(entity, course, userId, useLog, 1, 'Curso adicionado');
    };

    /**
     * Atualiza um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.update = function(userId, useLog, entity, data) {
        let CourseModel = this;

        return CourseModel.findOne({_id: data._id})
            .then((result) => {
                if (!result) {
                    let err = new Error("Dados inválidos");
                    err.status = 400;
                    throw err;
                }

                extendObj(true, result, data);
                return xDevSchema._update(entity, result, userId, useLog, 0, 'Curso atualizado');
            })
    };

    /**
     * Remove um curso
     * @param userId
     * @param useLog
     * @param entity
     * @param data
     * @returns {*}
     */
    CourseSchema.statics.delete = function(userId, useLog, entity, data) {
        return this.remove({"_id": data._id});
    };


    return xDevModel.model(client,'Course',CourseSchema);
}