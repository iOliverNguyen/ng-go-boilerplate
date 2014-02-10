module.exports = {

  /**
   * Target assets dir to copy files to
   * dist_dir    : directory to copy files when ready to deploy.
   * compile_dir : directory to copy compiled files.
   * assets_dir  : directory inside /public, for storing assets.
   */
  dist_dir: 'dist',
  compile_dir: 'bin',
  assets_dir: 'assets',

  app_files: {
    js: ['src/app/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
    jsunit: ['src/app/**/*.spec.js'],
    coffee: ['src/app/**/*.coffee', '!src/app/**/*.spec.coffee'],
    coffeeunit: ['src/app/**/*.spec.coffee'],
    tpls: ['src/app/**/*.tpl.html'],
    html: ['src/app/index.html'],
    less: ['src/less/**/*.less']
  },

  server_files: {
    js: [
      'src/server/**/*.js',
      '!src/server/**/*.min.js',
      '!src/server/**/*.spec.js',
      '!src/server/test/**/*.js'
    ],
    jsunit: ['src/server/**/*.spec.js'],
    coffee: ['src/server/**/*.coffee', '!src/server/**/*.spec.coffee'],
    coffeeunit: ['src/server/**/*.spec.coffee']
  },

  /**
   * These files will be copied unchanged to dist_dir and compile_dir.
   */
  root_files: [
    'src/server/**/*.go', '!src/server/**/*_test.go', '!src/server/**/__**',
    'LICENSE',
    'README.md',
    'importdb.sh',
    'importdb.bat'
  ],

  test_files: {
    js: ['vendor/angular-mocks/angular-mocks.js']
  },

  vendor_files: {
    js: [
      'vendor/angular/angular.js',
      'vendor/angular-bootstrap/ui-bootstrap.js',
      'vendor/angular-bootstrap/ui-bootstrap-tpls.js',
      'vendor/angular-ui-router/release/angular-ui-router.js',
      'vendor/angular-ui-utils/modules/route/route.js',
      'vendor/angular-sanitize/angular-sanitize.js'
    ],
    less: ['src/less/vendor.less'],
    assets: [
      'vendor/bootstrap/dist/fonts/*.*'
    ]
  }
};
