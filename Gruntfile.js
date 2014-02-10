module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt);

  var userConfig = require('./build.config.js');

  var jshintOptions = {
    '-W032': true, // W032: Unnecessary semicolon.
    '-W033': true, // W033: Missing semicolon.
  };

  var jshintOptionsAll = {
    bitwise: true,
    // camelcase: true,
    curly: true,
    // eqeqeq: true,
    eqnull: true,
    immed: true,
    latedef: 'nofunc',
    newcap: true,
    noarg: true,
    nonew: true,
    quotmark: 'single',
    sub: true,
    trailing: true,
    // undef: true,
    // unused: 'vars',

    // boss: true,

    browser: true,
    node: true,

    // maxcomplexity: 5,
    // maxdepth: 3,
    // maxlen: 120,
    // maxparams: 4,
    // maxstatements: 25,

    '-W024': true, // W024: Expected an identifier and instead saw 'delete' (a reserved word).
    '-W099': true, // W099: Mixes spaces and tabs.
  };

  var autoRestartServer = true;

  var taskConfig = {

    pkg: grunt.file.readJSON('package.json'),

    compile_tmp: '<%= compile_dir %>/_tmp',
    dest_appview: 'build/public',
    file_suffix: '-<%= pkg.version %>',
    gen_files: '<%= src_assets %>/*<%= file_suffix %>.*',
    node_cmd: 'node',
    src_assets: 'src/assets',

    meta: {
      banner:
        '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - ' + '<%= grunt.template.today("mmm dd, yyyy") %>\n' +
        ' * <%= pkg.homepage %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n'
    },

    empty: {
      all: [
        '<%= gen_files %>',
        'res/*.gen.*',
        '<%= dest_appview %>',
        '<%= src_assets %>/vendor',
        '<%= dist_dir %>',
        '<%= compile_dir %>'
      ],

      compile_tmp: ['<%= compile_tmp %>']
    },

    /**
     * This will map source files to dest files and execute tasks.
     * Useful for manipulating computer generated files.
     * Result is stored in map[target].destFiles and setConfig.
     *
     * Order: match -> preprocess -> prefilter -> replace -> postprocess -> postfilter
     * setConfig, tasks is not optional
     */
    map: {
      cleancoffee: {
        src: [
          '<%= app_files.coffee %>',
          '<%= server_files.coffee %>'
        ],
        replace: /\.coffee/,
        replaceBy: '.js',
        setConfig: ['empty.coffee.src'],
        tasks: ['empty:coffee']
      },

    },

    /**
     * This will watch for all changed files, filter for matched files.
     * Result is be store in changed[target].destFiles and set destConfig.
     * Run tasks for matching files.
     *
     * Usage:
     *   - config watch
     *   - config watchchange, target, tasks
     *
     * Options:
     *   - match, exclude, postfilter(file, action, target)
     */
    watchchange: {
      jssrc_app: {
        match: ['<%= app_files.js %>'],
        setConfig: ['jshint.changed.src'],
        prefilter: notCoffeeJS,
        tasks: ['jshint:changed', 'buildinc:client']
      },

      jssrc_server: {
        match: ['<%= server_files.js %>'],
        setConfig: ['jshint.changed.src'],
        prefilter: notCoffeeJS,
        tasks: function() {
          return ['jshint:changed', 'stopserver', 'startserver',
            'buildinc:server']
            .filter(function(task) {
              return autoRestartServer ||
                (task !== 'stopserver' && task !== 'startserver');
            });
        }
      },

      coffeesrc_app: {
        match: ['<%= app_files.coffee %>'],
        setConfig: ['coffeelint.changed.src', 'coffee.changed.src'],
        tasks: ['coffeelint:changed', 'coffee:changed', 'buildinc:client']
      },

      coffeesrc_server: {
        match: ['<%= server_files.coffee %>'],
        setConfig: ['coffeelint.changed.src', 'coffee.changed.src'],
        tasks: function() {
          return ['coffeelint:changed', 'coffee:changed', 'stopserver',
            'startserver', 'buildinc:server']
            .filter(function(task) {
              return autoRestartServer ||
                (task !== 'stopserver' && task !== 'startserver');
            });
        }
      },

      jsunit_app: {
        match: ['<%= app_files.jsunit %>'],
        prefilter: notCoffeeJS,
        setConfig: ['jshint.changed.src'],
        tasks: ['jshint:changed', 'karma:unit:run']
      },

      jsunit_server: {
        match: ['<%= server_files.jsunit %>'],
        prefilter: notCoffeeJS,
        setConfig: ['jshint.changed.src', 'mochaTest.changed.src'],
        tasks: ['jshint:changed', 'mochaTest:changed']
      },

      coffeeunit_app: {
        match: ['<%= app_files.coffeeunit %>'],
        setConfig: ['coffeelint.changed.src'],
        tasks: ['coffeelint:changed', 'karma:unit:run']
      },

      coffeeunit_server: {
        match: ['<%= server_files.coffeeunit %>'],
        setConfig: ['coffeelint.changed.src', 'mochaTest.changed.src'],
        tasks: ['coffeelint:changed', 'mochaTest:changed']
      },

      /*
      // Note: Experiment.
      // Uncomment these lines to automatically run testcases as soon as server restart.

      build_client: {
        match: ['res/build-client'],
        tasks: ['karma:unit:run']
      },

      build_server: {
        match: ['res/build-server'],
        tasks: function() {
          return grunt.config.get('mochaTest.changed.src') ? [
            'mochaTest:changed'
          ] : [];
        }
      }
      */
    },

    copy: {
      build_vendor_assets: {
        files: [{
          src: ['<%= vendor_files.assets %>'],
          dest: '<%= src_assets %>/vendor',
          expand: true,
          flatten: true
        }]
      },

      dist_assets: {
        files: [{
          src: ['**'],
          dest: '<%= dist_dir %>/public/<%= assets_dir %>',
          cwd: '<%= src_assets %>',
          expand: true
        }]
      },

      dist_js: {
        files: [{
          src: ['<%= app_files.js %>', '<%= vendor_files.js %>'],
          dest: '<%= dist_dir %>/public',
          cwd: '.',
          expand: true
        }]
      },

      dist_server: {
        files: [{
          src: [
            '**', '!main-dev.js', '!**.spec.js',
            '!**/*.coffee', '!**/*.ts'
          ],
          dest: '<%= dist_dir %>',
          cwd: 'src/server',
          expand: true
        }]
      },

      dist_root: {
        files: [{
          src: ['<%= root_files %>'],
          dest: '<%= dist_dir %>',
          cwd: '.',
          expand: true
        }]
      },

      compile_assets: {
        files: [{
          src: ['**', '!**/*<%= file_suffix %>.*'],
          dest: '<%= compile_dir %>/public/<%= assets_dir %>',
          cwd: '<%= src_assets %>',
          expand: true
        }]
      },

      compile_server: {
        files: [{
          src: [
            '**', '!main-dev.js', '!**.spec.js',
            '!**/*.coffee', '!**/*.ts'
          ],
          dest: '<%= compile_dir %>',
          cwd: 'src/server',
          expand: true
        }]
      },

      compile_root: {
        files: [{
          src: ['<%= root_files %>'],
          dest: '<%= compile_dir %>',
          cwd: '.',
          expand: true
        }]
      }
    },

    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: ['<%= app_files.coffee %>', '<%= server_files.coffee %>'],
        dest: '',
        ext: '.js'
      },

      changed: {
        expand: true,
        cwd: '.',
        src: [],
        dest: '',
        ext: '.js'
      }
    },

    coffeelint: {
      options: {
        max_line_length: {
          level: 'warn'
        }
      },

      source: {
        files: {
          src: ['<%= app_files.coffee %>', '<%= server_files.coffee %>']
        }
      },

      test: {
        files: {
          src: ['<%= app_files.coffeeunit %>', '<%= server_files.coffeeunit %>']
        }
      }
    },

    concat: {
      compile_js: {
        src: [
          '<%= vendor_files.js %>',
          '<%= compile_tmp %>/**/*.js',
          '<%= html2js.build.dest %>'
        ],
        dest: '<%= compile_dir %>/public/<%= assets_dir %>/main<%= file_suffix %>.js'
      }
    },

    ngmin: {
      compile: {
        files: [{
          src: ['<%= app_files.js %>'],
          cwd: '',
          dest: '<%= compile_tmp %>/',
          expand: true
        }]
      }
    },

    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },

    less: {
      build: {
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= src_assets %>/main<%= file_suffix %>.css.map',
          sourceMapURL: '/<%= assets_dir %>/main<%= file_suffix %>.css.map'
        },
        files: [{
          '<%= src_assets %>/main<%= file_suffix %>.css': 'src/less/main.less'
        }]
      },

      build_vendor: {
        options: {
          sourceMap: true,
          sourceMapFilename: '<%= src_assets %>/vendor<%= file_suffix %>.css.map',
          sourceMapURL: '/<% assets_dir %>/vendor<%= file_suffix %>.css.map'
        },
        files: {
          '<%= src_assets %>/vendor<%= file_suffix %>.css': '<%= vendor_files.less %>'
        }
      },

      compile: {
        options: {
          cleancss: true,
        },
        files: {
          '<%= compile_dir %>/public/<%= assets_dir %>/main<%= file_suffix %>.css': [
            '<%= vendor_files.less %>', 'src/less/main.less',
          ]
        }
      }
    },

    jshint: {
      source: ['<%= app_files.js %>', '<%= server_files.js %>'],

      gruntfile: {
        src: ['Gruntfile.js'],
        options: jshintOptions
      },

      test: {
        src: ['<%= app_files.jsunit %>', '<%= server_files.jsunit %>'],
        options: jshintOptions
      },

      changed: {
        src: [],
        options: jshintOptions
      },

      options: jshintOptionsAll
    },

    html2js: {
      build: {
        options: {
          base: 'src/app',
          module: 'templates',
          rename: function(moduleName) {
            return moduleName;
          }
        },
        src: ['<%= app_files.tpls %>'],
        dest: '<%= src_assets %>/templates<%= file_suffix %>.js'
      }
    },

    appview: {
      build_index: {
        files: ['src/appviews/index.html'],
        dir: '<%= dest_appview %>',
        // extension: '.ejs',
        dev: true,
        src: [
          '<%= vendor_files.js %>',
          '<%= app_files.js %>',
          '<%= html2js.build.dest %>',
          '<%= src_assets %>/vendor<%= file_suffix %>.css',
          '<%= src_assets %>/main<%= file_suffix %>.css'
        ]
      },

      build_views: {
        files: ['src/appviews/**/*.html', '!<%= appview.build_index.files %>'],
        dir: '<%= appview.build_index.dir %>',
        // extension: '.ejs',
        dev: true,
        src: [
          '<%= src_assets %>/vendor<%= file_suffix %>.css',
        ]
      },

      dist_index: {
        files: ['<%= appview.build_index.files %>'],
        dir: '<%= dist_dir %>/appviews',
        // extension: '.ejs',
        dev: false,
        src: ['<%= appview.build_index.src %>']
      },

      dist_views: {
        files: ['<%= appview.build_views.files %>'],
        dir: '<%= appview.dist_index.dir %>',
        // extension: '.ejs',
        dev: false,
        src: ['<%= appview.build_views.src %>']
      },

      compile_index: {
        files: ['<%= appview.build_index.files %>'],
        dir: '<%= compile_dir %>/appviews',
        // extension: '.ejs',
        src: [
          '<%= assets_dir %>/main<%= file_suffix %>.css',
          '<%= assets_dir %>/main<%= file_suffix %>.js'
        ],
        cwd: '<%= compile_dir %>/public'
      },

      compile_views: {
        files: ['<%= appview.build_views.files %>'],
        dir: '<%= appview.compile_index.dir %>',
        // extension: '.ejs',
        src: [
          '<%= assets_dir %>/main<%= file_suffix %>.css'
        ],
        cwd: '<%= compile_dir %>/public'
      }
    },

    packagejson: {
      dist: {
        dir: '<%= dist_dir %>'
      },

      compile: {
        dir: '<%= compile_dir %>'
      }
    },

    delta: {
      options: {
        livereload: false,
        dateFormat: formatDate,
        spawn: false
      },

      app_less: {
        files: ['<%= app_files.less %>'],
        tasks: ['less:build']
      },

      vendor_less: {
        files: ['<%= vendor_files.less %>'],
        tasks: ['less:build_vendor']
      },

      templates: {
        files: ['<%= app_files.tpls %>'],
        tasks: ['html2js:build']
      },

      index_view: {
        files: ['<%= appview.build_index.files %>'],
        tasks: ['appview:build_index'],
        options: {
          livereload: true
        }
      },

      app_views: {
        files: ['<%= appview.build_views.files %>'],
        tasks: ['appview:build_views'],
        options: {
          livereload: true
        }
      },

      source: {
        files: ['<%= app_files.js %>', '<%= server_files.js %>',
          '<%= app_files.coffee %>', '<%= server_files.coffee %>'
        ],
        tasks: []
      },

      gruntfile: {
        files: ['Gruntfile.js'],
        tasks: ['jshint:gruntfile'],
        options: {
          livereload: false
        }
      }
    },

    deltatest: {
      options: {
        livereload: false,
        spawn: false,
        dateFormat: formatDate
      },

      server: {
        files: ['<%= server_files.jsunit %>',
          '<%= server_files.coffeeunit %>',
          'res/build-server'
        ],
        tasks: []
      },

      client: {
        files: ['<%= app_files.jsunit %>',
          '<%= app_files.coffeeunit %>',
          'res/build-client',
        ],
        tasks: []
      }
    },

    karma: {
      unit: {
        port: 9877,
        background: true,
        options: {
          reporters: ['spec'],
          configFile: 'res/karma.gen.js',
        }
      },
      continuous: {
        singleRun: true,
        options: {
          configFile: 'res/karma.gen.js'
        }
      }
    },

    karmaconfig: {
      unit: {
        dest: 'res/karma',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.build.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec',
        require: ['blanket', 'coffee-script'],
        clearRequireCache: true
      },

      test: {
        src: ['<%= server_files.jsunit %>', '<%= server_files.coffeeunit %>']
      },

      quick: {
        src: ['<%= server_files.jsunit %>'],
        options: {
          reporter: 'dot'
        },
      },

      coverage: {
        options: {
          reporter: 'html-cov',
          quiet: true,
          captureFile: '__coverage.html'
        }
      }
    },

    express: {
      options: {
        cmd: '<%= node_cmd %>',
        port: 80,
        output: 'Server is listening',
        delay: 3000
      },

      dev: {
        options: {
          script: 'src/server/main-dev.js',
          args: [],
          node_env: 'development',
          debug: true,
          background: true
        }
      },

      dist: {
        options: {
          script: '<%= dist_dir %>/main.js',
          args: [],
          node_env: '',
          background: true
        }
      },

      compile: {
        options: {
          script: '<%= compile_dir %>/main.js',
          args: [],
          node_env: '',
          background: true
        }
      }
    },

    exec: {
      importdb: {
        cmd: execCmd('importdb')
      }
    },
  };

  grunt.initConfig(grunt.util._.extend(taskConfig, userConfig));

  function formatDate(time) {
    grunt.log.writeln('Completed in ' + (time + 'ms').cyan +
      ' at ' + (new Date()).toTimeString().slice(0, 8).cyan);
  }

  function execCmd(cmd) {
    var isWin = !! process.platform.match(/^win/);
    return isWin ? cmd + '.bat' : './' + cmd + '.sh';
  }

  function notCoffeeJS(file) {
    return !grunt.file.exists(file.replace(/\.js/, '.coffee'));
  }

  function filterForJS(files) {
    return files.filter(function(file) {
      return file.match(/\.js$/);
    });
  }

  function filterForCSS(files) {
    return files.filter(function(file) {
      return file.match(/\.css$/);
    });
  }

  function filterForCoffee(files) {
    return files.filter(function(file) {
      return file.match(/\.coffee$/);
    });
  }

  var assetsRE;

  function replaceSrcAssets(path) {
    assetsRE = assetsRE || new RegExp('^(' +
      grunt.config('src_assets').replace(/\//g, '\\\/') + ')');
    return path.replace(assetsRE, grunt.config('assets_dir'));
  }

  var path = require('path');
  grunt.registerMultiTask('appview',
    'Process appview.html and views files.',
    function() {

      var dir = this.data.dir;
      var data = this.data;
      var isDev = this.data.dev;
      var dirRE = new RegExp('^(' + grunt.config('dist_dir') + '|' +
        grunt.config('compile_dir') + ')\/', 'g');

      var jsFiles = filterForJS(this.filesSrc).map(function(file) {
        return '/' + replaceSrcAssets(file.replace(dirRE, ''));
      });

      var cssFiles = filterForCSS(this.filesSrc).map(function(file) {
        return '/' + replaceSrcAssets(file.replace(dirRE, ''));
      });

      var filesView = grunt.file.expand(data.files);
      filesView.map(function(oneFile) {

        var filename = data.extension ?
          path.basename(oneFile).replace(/\..+$/, data.extension) :
          path.basename(oneFile);

        var dest = path.join(dir, filename);
        grunt.file.copy(oneFile, dest, {
          process: function(contents, path) {
            return grunt.template.process(contents, {
              data: {
                scripts: jsFiles,
                styles: cssFiles,
                version: grunt.config('pkg.version'),
                livereload: isDev
              }
            });
          }
        });

        grunt.verbose.writeln('File ' + dest.cyan + ' created.');
      });

      grunt.log.writeln('Created ' + filesView.length.toString().cyan +
        ' file' + (filesView.length <= 1 ? '.' : 's.'));
    });

  grunt.registerMultiTask('packagejson',
    'Process package.json',
    function() {
      var json = grunt.file.readJSON('package.json');
      var dist_json = {};

      for (var i in json) {
        if (i != 'devDependencies') {
          dist_json[i] = json[i];
        }
      }

      grunt.file.write(this.data.dir + '/package.json',
        JSON.stringify(dist_json, null, '    '));
    });

  grunt.registerMultiTask('karmaconfig',
    'Process karma config templates.',
    function() {

      var jsFiles = filterForJS(this.filesSrc);

      grunt.file.copy('res/karma.tpl.js',
        this.data.dest + '.gen.js', {
          process: function(contents, path) {
            return grunt.template.process(contents, {
              data: {
                scripts: jsFiles
              }
            });
          }
        });
    });

  grunt.registerTask('norestart',
    'Config express server not automatically restart.',
    function() {
      autoRestartServer = false;
    });

  grunt.registerTask('buildinc',
    'Increase build number',
    function() {

      var arg = this.args[0];
      if (!arg) {
        grunt.log.writeln('No given arg');
        return;
      }

      var filename = 'res/build-' + arg;

      var s = '';
      try {
        s = grunt.file.read(filename);
      } catch (e) {}

      var ss = s.split('-');

      var n = parseInt(ss[1]);
      n = n > 0 ? n + 1 : 1;

      var d = new Date();
      var ns = d.getFullYear() +
        (d.getMonth() + 1 < 10 ? '0' : '') + (d.getMonth() + 1) +
        (d.getDate() < 10 ? '0' : '') + d.getDate() +
        '-' + (n + 10000).toString().slice(1);

      try {
        grunt.file.write(filename, ns);
      } catch (e) {
        grunt.log.writeln('Could not write to file ' + filename.cyan);
      }
    });

  grunt.registerTask('startserver', 'Start server.', []);
  grunt.registerTask('stopserver', 'Stop server.', []);

  grunt.renameTask('clean', 'empty');
  grunt.registerTask('clean', [
    'empty:all',
    'map:cleancoffee'
  ]);

  grunt.registerTask('default',
    'Build, compile project and run tests. Require mongod running.', [
      'build',
      'karma:continuous',
      'compile',
      'exec:importdb',
      'express:compile',
      'mochaTest:quick'
    ]);

  grunt.registerTask('build',
    'Clean and build project.', [
      'clean',
      'jshint:source',
      'jshint:test',
      'html2js:build',
      'less:build',
      'less:build_vendor',
      'coffee:source',
      'appview:build_index',
      'appview:build_views',
      'copy:build_vendor_assets',
      'karmaconfig'
    ]);

  grunt.registerTask('dist',
    'Copy project files to dist directory. Must run `grunt build` first.', [
      'packagejson:dist',
      // 'copy:dist_server',
      'copy:dist_assets',
      'copy:dist_js',
      'copy:dist_root',
      'appview:dist_index',
      'appview:dist_views'
    ]);

  grunt.registerTask('compile',
    'Compile project files to bin directory. Must run `grunt build` first.', [
      'packagejson:compile',
      // 'copy:compile_server',
      'copy:compile_assets',
      'copy:compile_root',
      'less:compile',
      'ngmin',
      'concat:compile_js',
      'empty:compile_tmp',
      'uglify',
      'appview:compile_index',
      'appview:compile_views'
    ]);

  grunt.registerTask('test',
    'Start server and run all tests. Must run `grunt build` first.', [
      'exec:importdb',
      'startserver',
      'karma:continuous',
      'mochaTest:test'
    ]);

  grunt.registerTask('runtests',
    'Run all tests. Must start server first.', [
      'exec:importdb',
      'karma:continuous',
      'mochaTest:test'
    ]);

  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch',
    'Build project and restart server as files changed.', [
      'build',
      'watchchange',
      'startserver',
      'delta'
    ]);

  grunt.registerTask('quickwatch',
    'Build project without starting server as files changed.', [
      'norestart',
      'watchchange',
      'delta'
    ]);

  grunt.registerTask('inspector',
    'Use with node-inspector. Do not restart server as files changed.', [
      'norestart',
      'watchchange',
      'startserver',
      'delta'
    ]);

  grunt.registerTask('theseus',
    'Use with theseus. Build project and restart server with node-theseus as files changed.',
    function() {
      grunt.config.set('node_cmd', 'node-theseus');

      for (var i in grunt.config.get('express')) {
        var p = ['express', i, 'options', 'debug'];
        grunt.config.set(p, false);
      }

      grunt.task.run([
        'watchchange',
        'startserver',
        'delta'
      ]);
    });

  grunt.registerTask('watchtest',
    'Watch all test files and run them when changed.',
    function() {
      grunt.renameTask('delta', 'deltatest');

      var tasks = ['watchchange'];
      var arg = this.args[0];
      if (arg != 'server') {
        tasks.push('karma:unit');
      }
      tasks.push(arg ? 'deltatest:' + arg : 'deltatest');

      grunt.task.run(tasks);
    });
};
