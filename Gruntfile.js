module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      config: {
        name : "chrome-storage-largeSync"
      },
      uglify: {
        my_target_min: {
          files: {
            'dist/<%= config.name %>.min.js': 
              [
                'src/<%= config.name %>.js',
                'bower_components/lz-string/libs/lz-string.js'
              ]
          }
        },
        my_target_not_min: {
          options : {
            preserveComments : 'all',
            mangle: false,
            beautify: true
          },
          files: {
            'dist/<%= config.name %>.js':
              [
                'src/<%= config.name %>.js',
                'bower_components/lz-string/libs/lz-string.js'
              ]
          }
        }
      },
      'string-replace': {
        version: {
          files: {
            'dist/' : 'dist/**'
          },
          options: {
            replacements: [{
              pattern: /{{ VERSION }}/g,
              replacement: '<%= pkg.version %>'
            }]
          }
        }
      },
      // copy source files to the test folder.
      copy : {
        main : {
          files : [
             {expand: true, src: ['src/*'], dest: 'test/lib/', filter: 'isFile'},
             {expand: true, src: ['bower_components/**'], dest: 'test/lib/'}      
          ]
        }
      },
      watch: {
        files: ['src/*'],
        tasks: ['copy'],
      }
  });

  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify','string-replace', 'copy']);
  grunt.registerTask('copyfiles', ['copy']);

};