module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    bump: {
      options: {
        files: ['package.json'],
        updateConfigs: ['pkg'],
        commit: false,
        createTag: false,
        push: false
      }
    },
    less: {
      options: {
        compress: true
      },
      dist: {
        files: {
          'public/css/style.css': ['public/css/style.less']
        }
      }
    },
    browserify: {
      options: {
        transform: [ require('grunt-react').browserify ]
      },
      dev: {
        src: 'public/js/index.js',
        dest: 'public/js/min/<%= pkg.name %>.js'
      }
    },
    watch: {
      options: {
        spawn: false,
        livereload: true
      },
      browserify: {
        files: ['public/js/**/*.js', 'public/js/*.jsx'],
        tasks: ['bump', 'browserify'],
      },
      css: {
        files: 'public/css/*.less',
        tasks: ['bump', 'less']
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['bump', 'less', 'browserify', 'watch']);
  grunt.registerTask('prod', ['less', 'browserify']);

};