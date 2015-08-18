module.exports = (grunt)->
  require('load-grunt-tasks')(grunt)
  require('time-grunt')(grunt)

  grunt.initConfig
    watch:
      html:
        files: 'index.html'
        options:
          livereload: 35729
      js:
        files: 'js/src/*.js'
        tasks: ['clean:js', 'concat:js']
        options:
          livereload: 35729
    connect:
      server:
        options:
          port: 1001
          base: ''
          keepalive: true
          livereload: 35729
    concurrent:
      dev:
        tasks: ['connect', 'watch']
        options:
          logConcurrentOutput: true
    bowerInstall:
      default:
        src: 'index.html'
    clean:
      js:
        src: ['js/game.js']
    concat:
      js:
        files:
          'js/game.js': ['js/src/init.js', 'js/src/*.state.js', 'js/src/main.js']

  grunt.registerTask 'default', ['concurrent']