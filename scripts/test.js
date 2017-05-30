if (!process.env['DEBUG']) {
  process.env['DEBUG'] = 'pops-*';
}
//ALLOW_CONFIG_MUTATIONS
if (!process.env['ALLOW_CONFIG_MUTATIONS']) {
  process.env['ALLOW_CONFIG_MUTATIONS'] = 'true';
}
require('source-map-support/register');
var Jasmine = require('jasmine');
var jasmine = new Jasmine();
var SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.configureDefaultReporter({});
jasmine.addReporter(new SpecReporter());
const config = require(`${process.cwd()}/jasmine.json`);
if (process.env.TEST_FILES) {
  //"spec_files": [ "**/*.spec.js" ],
  console.log('process.env.TEST_FILES', process.env.TEST_FILES);
  config['spec_files'] = process.env.TEST_FILES.split(',').map(function (d) {
    return d.trim();
  });
  console.log('config[\'spec_files\']', config['spec_files']);
}
global['testAsync'] = function testAsync(runAsync) {
  return (done) => {
    runAsync()
      .then(done)
      .catch(e => {
        console.error('-------failed-----', e);
        try {
          fail(e);
        } catch (e) {
          done();
        }
      });
  };
};
jasmine.loadConfig(config);

jasmine.execute();
