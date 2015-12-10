module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: ['dist', '.tmp'],
        apidoc: {
            b4uv11 : {
                src: "routes/",
                dest: "public/apidoc/",
                options: {
                    debug: true
                }
            }
        },
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/**/*Spec.js']
            }
        }
    });


    grunt.registerTask('default', ['clean','apidoc']);
    grunt.registerTask('test', 'mochaTest');


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-apidoc');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');

};
