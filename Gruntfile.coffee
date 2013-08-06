module.exports = (grunt) ->
  grunt.initConfig
    concat:
      normal:
        src: ['src/normal/header.js', 'dist/zpipe.raw.js', 'src/normal/footer.js']
        dest: 'dist/zpipe_normal.js'
      optimize1:
        src: ['src/optimize1/header.js', 'dist/zpipe.raw.js', 'src/optimize1/footer.js']
        dest: 'dist/zpipe_optimize1.js'
      optimize2:
        src: ['src/optimize2/header.js', 'dist/zpipe.raw.js', 'src/optimize2/footer.js']
        dest: 'dist/zpipe_optimize2.js'

    exec:
      buildZlib:
        cmd: 'cd zlib && emconfigure ./configure && make'
      cleanZlib:
        cmd: 'cd zlib && make clean'
      buildZpipe:
        cmd: 'emcc -O2 --closure 0 zlib/examples/zpipe.c zlib/libz.a -o dist/zpipe.raw.js'

    connect:
      livereload:
        options:
          port: 9001
          host: 'localhost'

    watch:
      options:
        livereload: true
      js:
        files: 'src/**/*.js'
        tasks: ['concat']

  grunt.registerTask 'devserver', ['connect', 'watch']
  grunt.registerTask 'build', ['exec:buildZlib', 'exec:buildZpipe', 'concat']
  grunt.loadNpmTasks 'grunt-contrib-concat'
  grunt.loadNpmTasks 'grunt-exec'
  grunt.loadNpmTasks 'grunt-contrib-connect'
  grunt.loadNpmTasks 'grunt-contrib-watch'

