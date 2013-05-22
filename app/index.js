'use strict';

var util = require('util');
var path = require('path');
var yeoman = require('yeoman-generator');


var AngularPhonegapLungoGenerator = module.exports = function AngularPhonegapLungoGenerator(args, options, config) {
  yeoman.generators.Base.apply(this, arguments);

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

  this.indexFile = this.readFileAsString(path.join(this.sourceRoot(), 'index.html'));
  this.pkg = JSON.parse(this.readFileAsString(path.join(__dirname, '../package.json')));
};

util.inherits(AngularPhonegapLungoGenerator, yeoman.generators.NamedBase);

AngularPhonegapLungoGenerator.prototype.askFor = function askFor() {
  var cb = this.async();

  // welcome message
  var welcome =
  '\n     _-----_' +
  '\n    |       |' +
  '\n    |' + '--(o)--'.red + '|   .--------------------------.' +
  '\n   `---------´  |    ' + 'Welcome to the Angular Phonegap Lungo Generator,'.yellow.bold + '    |' +
  '\n    ' + '( '.yellow + '_' + '´U`'.yellow + '_' + ' )'.yellow + '   |   ' + 'ladies and gentlemen!'.yellow.bold + '  |' +
  '\n    /___A___\\   \'__________________________\'' +
  '\n     |  ~  |'.yellow +
  '\n   __' + '\'.___.\''.yellow + '__' +
  '\n ´   ' + '`  |'.red + '° ' + '´ Y'.red + ' `\n';

  console.log(welcome);
  console.log('Out of the box I include QuoJS, Lungo, Angular with Phonegap and Heroku support.');

  var prompts = [{
    name: 'herokuSupport',
    message: 'Would you like to be able to deploy this app on Heroku?',
    'default': 'y/n'
  }];

  this.prompt(prompts, function (err, props) {
    if (err) {
      return this.emit('error', err);
    }

    this.herokuSupport = (/y/i).test(props.herokuSupport);

    cb();
  }.bind(this));
};

AngularPhonegapLungoGenerator.prototype.app = function app() {
  this.mkdir('app');
  this.mkdir('app/fonts');
  this.mkdir('app/images');
  this.mkdir('app/scripts');
  this.mkdir('app/styles');
  this.mkdir('app/views');
};

AngularPhonegapLungoGenerator.prototype.iosResources = function app() {
  this.mkdir('app/res');
  this.mkdir('app/res/icon');
  this.mkdir('app/res/screen');
};

AngularPhonegapLungoGenerator.prototype.git = function git() {
  this.copy('gitignore', '.gitignore');
  this.copy('gitattributes', '.gitattributes');
};

AngularPhonegapLungoGenerator.prototype.bower = function bower() {
  this.copy('bowerrc', '.bowerrc');
  this.copy('_bower.json', 'bower.json');
};

AngularPhonegapLungoGenerator.prototype.packageFile = function packageFile() {
  this.copy('_package.json', 'package.json');
};

AngularPhonegapLungoGenerator.prototype.gruntfile = function gruntfile() {
  this.template('Gruntfile.js');
};

AngularPhonegapLungoGenerator.prototype.projectfiles = function projectfiles() {
  this.copy('editorconfig', '.editorconfig');
  this.copy('jshintrc', '.jshintrc');
};
