module.exports = function(grunt) {

  grunt.initConfig({
      pkg: grunt.file.readJSON('package.json'),
      config: {
        name : "chrome-storage-largeSync"
      },
      uglify: {
        my_target_min: {
          files: {
            'dist/<%= pkg.name %>.min.js': 
              [
                'src/<%= pkg.name %>.js',
                'bower_components/lz-string/libs/lz-string.js'
              ]
          }
        },
        my_target_not_min: {
          options : {
            mangle: false,
            beautify: true
          },
          files: {
            'dist/<%= pkg.name %>.js':
              [
                'src/<%= pkg.name %>.js',
                'bower_components/lz-string/libs/lz-string.js'
              ]
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


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['uglify', 'copy']);
  grunt.registerTask('copyfiles', ['copy']);

};