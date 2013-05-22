'use strict';
var lrSnippet = require('grunt-contrib-livereload/lib/utils').livereloadSnippet;
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // configurable paths
  var yeomanConfig = {
    app: 'app',
    dist: 'dist',
    xcode: 'phonegap/xcode'
  };

  try {
    yeomanConfig.app = require('./bower.json').appPath || yeomanConfig.app;
  } catch (e) {}

  grunt.initConfig({
    yeoman: yeomanConfig,
    watch: {
      coffee: {
        files: ['<%%= yeoman.app %>/scripts/{,*/}*.coffee'],
        tasks: ['coffee:dist']
      },
      coffeeTest: {
        files: ['test/spec/{,*/}*.coffee'],
        tasks: ['coffee:test']
      },
      compass: {
        files: ['<%%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
        tasks: ['compass']
      },
      livereload: {
        files: [
          '<%%= yeoman.app %>/{,*/}*.html',
          '{.tmp,<%%= yeoman.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= yeoman.app %>}/scripts/{,*/}*.js',
          '<%%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['livereload']
      }
    },
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, yeomanConfig.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      }
    },
    open: {
      server: {
        url: 'http://<%%= connect.options.hostname %>:<%%= connect.options.port %>'
      }
    },
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%%= yeoman.dist %>/*',
            '!<%%= yeoman.dist %>/.git*'
          ]
        }]
      },
      xcode: {
        files: [{
          dot: true,
          src: [
            '<%%= yeoman.xcode %>/www/*',
            '<%%= yeoman.xcode %>/Resources/{icons,splash}/*.png'
          ]
        }]
      },
      server: '.tmp'
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: [
        'Gruntfile.js',
        '<%%= yeoman.app %>/scripts/{,*/}*.js'
      ]
    },<% if (testFramework === 'mocha') { %>
    mocha: {
      all: {
        options: {
          run: true,
          urls: ['http://<%%= connect.options.hostname %>:<%%= connect.options.port %>/index.html']
        }
      }
    },<% } else if (testFramework === 'jasmine') { %>
    jasmine: {
      all: {
        /*src: '',*/
        options: {
          specs: 'test/spec/{,*/}*.js'
        }
      }
    },<% } %>
    coffee: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/scripts',
          src: '{,*/}*.coffee',
          dest: '.tmp/scripts',
          ext: '.js'
        }]
      },
      test: {
        files: [{
          expand: true,
          cwd: 'test/spec',
          src: '{,*/}*.coffee',
          dest: '.tmp/spec',
          ext: '.js'
        }]
      }
    },
    compass: {
      options: {
        sassDir: '<%%= yeoman.app %>/styles',
        cssDir: '.tmp/styles',
        imagesDir: '<%%= yeoman.app %>/images',
        javascriptsDir: '<%%= yeoman.app %>/scripts',
        fontsDir: '<%%= yeoman.app %>/styles/fonts',
        importPath: '<%%= yeoman.app %>/components',
        relativeAssets: true
      },
      dist: {},
      server: {
        options: {
          debugInfo: true
        }
      }
    },
    imageEmbed: {
      dist: {
        src: ['<%%= yeoman.app %>/styles/fonts.css'],
        dest: '<%%= yeoman.app %>/styles/fonts.css',
        options: {
          deleteAfterEncoding : false
        }
      }
    },
    concat: {
      dist: {
        files: {
          '<%%= yeoman.dist %>/scripts/scripts.js': [
            '.tmp/scripts/{,*/}*.js',
            '<%%= yeoman.app %>/scripts/{,*/}*.js'
          ]
        }
      }
    },
    useminPrepare: {
      html: '<%%= yeoman.app %>/index.html',
      options: {
        dest: '<%%= yeoman.dist %>'
      }
    },
    usemin: {
      html: ['<%%= yeoman.dist %>/{,*/}*.html'],
      css: ['<%%= yeoman.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%%= yeoman.dist %>']
      }
    },
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg}',
          dest: '<%%= yeoman.dist %>/images'
        }]
      }
    },
    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%%= yeoman.dist %>/images'
        }]
      }
    },
    cssmin: {
      dist: {
        files: {
          '<%%= yeoman.dist %>/styles/main.css': [
            '.tmp/styles/{,*/}*.css',
            '<%%= yeoman.app %>/styles/{,*/}*.css'
          ]
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          // removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          // collapseWhitespace: true,
          // collapseBooleanAttributes: true,
          // removeAttributeQuotes: true,
          // removeRedundantAttributes: true,
          // useShortDoctype: true,
          // removeEmptyAttributes: true,
          // removeOptionalTags: true
        },
        files: [{
          expand: true,
          cwd: '<%%= yeoman.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%%= yeoman.dist %>'
        }]
      }
    },
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%%= yeoman.dist %>/scripts',
          src: '*.js',
          dest: '<%%= yeoman.dist %>/scripts'
        }]
      }
    },
    uglify: {
      dist: {
        files: {
          '<%%= yeoman.dist %>/scripts/scripts.js': [
            '<%%= yeoman.dist %>/scripts/scripts.js'
          ]
        }
      }
    },
    rev: {
      dist: {
        files: {
          src: [
            '<%%= yeoman.dist %>/scripts/{,*/}*.js',
            '<%%= yeoman.dist %>/styles/{,*/}*.css',
            '<%%= yeoman.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%%= yeoman.dist %>/styles/fonts/*'
          ]
        }
      }
    },
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.dist %>',
          src: [
            'CNAME',
            '*.{ico,txt,png}',
            '.htaccess',
            'components/**/*',
            'fonts/**/*',
            'images/**/*',
            'res/**/*',
            'styles/fonts/*'
          ]
        }, {
          expand: true,
          src: ['Config.xml'],
          dest: '<%%= yeoman.dist %>'
        }]
      },
      xcode: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%= yeoman.app %>',
          dest: '<%%= yeoman.xcode %>/www',
          src: [
            'index.html',
            'components/**/*',
            'images/**/*',
            'scripts/**/*',
            'fonts/**/*',
            'views/**/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/styles',
          dest: '<%%= yeoman.xcode %>/www/styles',
          src: ['*']
        }, {
          expand: true,
          cwd: 'vendor',
          dest: '<%%= yeoman.xcode %>/www',
          src: ['phonegap.js']
        }, {
          expand: true,
          cwd: '<%%= yeoman.app %>/res/icon/ios',
          dest: '<%%= yeoman.xcode %>/Resources/icons',
          src: ['*.png']
        }, {
          expand: true,
          cwd: '<%%= yeoman.app %>/res/screen/ios',
          dest: '<%%= yeoman.xcode %>/Resources/splash',
          src: ['*.png']
        }]
      }
    },
    'phonegap-build': {
      debug: {
        options: {
          timeout: 15000, // 15 sec.
          archive: 'phonegap/app.zip',
          appId: '',
          user: {
            token: ''
          }
        }
      },
      release: {
        options: {
          timeout: 15000, // 15 sec.
          archive: 'phonegap/app.zip',
          appId: '',
          user: {
            token: ''
          }
        }
      }
    },
    compress: {
      dist: {
        options: {
          archive: 'phonegap/app.zip'
        },
        files: [
          {src: ['Config.xml']},
          {expand: true, cwd: 'dist/', src: ['**']}
        ]
      }
    },
    manifest: {
      dist: {
        options: {
          basePath: '<%%= yeoman.dist %>',
          network: ['http://*', 'https://*'],
          // fallback: ['/ /offline.html'],
          preferOnline: true,
          verbose: true,
          timestamp: true
        },
        src: [
          'index.html',
          'scripts/{,*/}*.js',
          'styles/{,*/}*.css',
          'fonts/{,*/}*.woff',
          'images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
          'res/**/*.png',
          'views/{,*/}*.html',
        ],
        dest: '<%%= yeoman.dist %>/manifest.appcache'
      }
    }
  });

  grunt.renameTask('regarde', 'watch');

  grunt.registerTask('server', [
    'clean:server',
    'coffee:dist',
    'compass:server',
    'livereload-start',
    'connect:livereload',
    'open',
    'watch'
  ]);

  grunt.registerTask('test', [
    'clean:server',
    'coffee',
    'compass',
    'connect:test',
    'mocha'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'jshint',
    'test',
    'coffee',
    'compass:dist',
    'useminPrepare',
    'imagemin',
    'cssmin',
    'htmlmin',
    'concat',
    'copy:dist',
    'ngmin',
    'uglify',
    'rev',
    'usemin',
    // 'manifest'
  ]);

  grunt.registerTask('phonegap', [
    'build',
    'compress',
    'phonegap-build:debug'
  ]);

  grunt.registerTask('xcode', [
    'clean:xcode',
    'build',
    'copy:xcode'
  ]);

  grunt.registerTask('default', ['build']);
};
