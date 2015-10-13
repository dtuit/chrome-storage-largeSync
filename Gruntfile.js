module.exports = function(grunt) {

  grunt.initConfig({
    uglify: {
    my_target: {
      files: {
        'dist/chrome-storage-syncmore.min.js': 
          [
            'src/chrome-storage-syncmore.js',
            'bower_components/lz-string/libs/lz-string.js'
          ]
      }
    }
  },
  copy : {
    main : {
      files : [
      
         {expand: true, src: ['src/*'], dest: 'test/lib/', filter: 'isFile'},
         {expand: true, src: ['bower_components/**'], dest: 'test/lib/'}      
      ]
    }
  }
  });


  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['uglify', 'copy']);

};