module.exports = function(config) {
  config.set({
    /**
     * From where to look for files, starting with the location of this file.
     */
    basePath: '../',

    /**
     * This is the list of file patterns to load into the browser during testing.
     */
    files: [  'vendor/angular/angular.js',  'vendor/angular-bootstrap/ui-bootstrap.js',  'vendor/angular-bootstrap/ui-bootstrap-tpls.js',  'vendor/angular-ui-router/release/angular-ui-router.js',  'vendor/angular-sanitize/angular-sanitize.js',  'src/assets/templates-0.0.1.js',  'vendor/angular-mocks/angular-mocks.js', 
      'src/app/**/*.js',
      'src/app/**/*.coffee'
    ],
    exclude: [

    ],
    frameworks: ['mocha', 'chai'],
    plugins: ['karma-mocha', 'karma-chai', 'karma-spec-reporter',
      'karma-firefox-launcher', 'karma-chrome-launcher',
      'karma-phantomjs-launcher', 'karma-coffee-preprocessor'
    ],
    preprocessors: {
      '**/*.coffee': 'coffee',
    },

    /**
     * How to report, by default.
     */
    reporters: 'dots',

    /**
     * On which port should the browser connect, on which port is the test runner
     * operating, and what is the URL path for the browser to use.
     */
    port: 9018,
    runnerPort: 9101,
    urlRoot: '/',

    /**
     * Disable file watching by default.
     */
    autoWatch: false,

    /**
     * The list of browsers to launch to test on. This includes only "Firefox" by
     * default, but other browser names include:
     * Chrome, ChromeCanary, Firefox, Opera, Safari, PhantomJS
     *
     * Note that you can also use the executable name of the browser, like "chromium"
     * or "firefox", but that these vary based on your operating system.
     *
     * You may also leave this blank and manually navigate your browser to
     * http://localhost:9018/ when you're running tests. The window/tab can be left
     * open and the tests will automatically occur there during the build. This has
     * the aesthetic advantage of not launching a browser every time you save.
     */
    browsers: [
      'Chrome'
    ]
  });
};
