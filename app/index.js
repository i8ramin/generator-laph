'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var LaphGenerator = module.exports = function LaphGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

  this.argument('appname', { type: String, required: false });
  this.appname = this.appname || path.basename(process.cwd());

  var args = ['main'];

  if (typeof this.env.options.appPath === 'undefined') {
    try {
      this.env.options.appPath = require(path.join(process.cwd(), 'bower.json')).appPath;
    } catch (e) {}
    this.env.options.appPath = this.env.options.appPath || 'app';
  }

  this.appPath = this.env.options.appPath;

  if (typeof this.env.options.coffee === 'undefined') {
    this.option('coffee');

    // attempt to detect if user is using CS or not
    // if cml arg provided, use that; else look for the existence of cs
    if (!this.options.coffee &&
      this.expandFiles(path.join(this.appPath, '/scripts/**/*.coffee'), {}).length > 0) {
      this.options.coffee = true;
    }

    this.env.options.coffee = this.options.coffee;
  }

  if (typeof this.env.options.minsafe === 'undefined') {
    this.option('minsafe');
    this.env.options.minsafe = this.options.minsafe;
    args.push('--minsafe');
  }

  // setup the test-framework property, Gruntfile template will need this
  this.testFramework = options['test-framework'] || 'mocha';

  // for hooks to resolve on mocha by default
  if (!options['test-framework']) {
    options['test-framework'] = 'mocha';
  }

  // resolved to mocha by default (could be switched to jasmine for instance)
  this.hookFor('test-framework', { as: 'app' });

  this.on('end', function () {
    this.installDependencies({ skipInstall: options['skip-install'] });
  });

  // this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(LaphGenerator, yeoman.generators.NamedBase);

LaphGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to Yeoman,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);
  console.log('Lungo (QuoJS) + Angular with optional Phonegap and Heroku support.\n');

  var prompts = [{
    name: 'herokuSupport',
    message: 'Would you like to be able to deploy this app on Heroku?',
    'default': 'y/n'
  }, {
    name: 'phonegapSupport',
    message: 'Would you like to be able to build this app as a Phonegap app?',
    'default': 'y/n'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.herokuSupport = (/y/i).test(props.herokuSupport);
    this.phonegapSupport = (/y/i).test(props.phonegapSupport);

    cb();
  }.bind(this));
};

LaphGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/fonts');
  this.mkdir('app/images');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/views');

  this.write(path.join(this.appPath, 'styles/main.scss'), '@import "compass";');

  this.copy('index.html', 'app/index.html');
};

LaphGenerator.prototype.iosResources = function app() {
  this.mkdir('app/res');
  this.mkdir('app/res/icon');
  this.mkdir('app/res/screen');
};

LaphGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

LaphGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

LaphGenerator.prototype.packageFile = function packageFile() {
  this.copy('_package.json', 'package.json');
};

LaphGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

LaphGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};

LaphGenerator.prototype.setupHeroku = function projectfiles() {
  if (this.herokuSupport) {
    this.copy('_Procfile', 'Procfile');
    this.copy('_web.js', 'web.js');
  }
};

LaphGenerator.prototype.setupPhonegap = function projectfiles() {
  if (this.phonegapSupport) {
    this.mkdir('phonegap');
    this.mkdir('phonegap/xcode');
  }
};
