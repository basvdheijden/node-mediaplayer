module.exports = function(grunt) {
  var gruntSettings = {
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'index.js'
      ],

      options: {
        'curly': true,
        'eqeqeq': true,
        'forin': true,
        'immed': true,
        'indent': 2,
        'latedef': true,
        'newcap': true,
        'noarg': true,
        'sub': true,
        'unused': true,
        'boss': true,
        'eqnull': true,
        'node': true,
        'quotmark': 'single',
        'trailing': true
      }
    }
  };

  grunt.initConfig(gruntSettings);

  grunt.loadNpmTasks('grunt-contrib-jshint');

  // Run all tests
  grunt.registerTask('default', ['jshint']);
};