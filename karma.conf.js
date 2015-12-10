// karma.conf.js
module.exports = function(config) {
    config.set({
        basePath: '',
        autoWatch: true,
        frameworks: ['mocha','commonjs','chai'],
        files: [
            'test/**/*.js'
        ],
        plugins: [
            'karma-coverage',
            'karma-mocha',
            'karma-chai',
            'karma-commonjs',
            'karma-phantomjs-launcher'
        ],

        // coverage reporter generates the coverage
        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'test/**/*.js': ['commonjs'],
            'controllers/**/*.js': [  'coverage'],
            'models/**/*.js': [  'coverage'],
            'config/**/*.js': [  ,'coverage'],
            'routes/**/*.js': [ 'coverage'],
            'services/**/*.js': [ 'coverage'],
        },

        browsers: ['PhantomJS'], // , 'Firefox'],

        singleRun: true,

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/'
        },

        commonjsPreprocessor: {
            modulesRoot: '../node_modules'
        }
    });
};