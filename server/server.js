'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');
//var cfenv = require('cfenv');

var app = module.exports = loopback();

app.start = function() {
  // start the web server
  return app.listen(function() {
    app.emit('started');
    var baseUrl = app.get('url').replace(/\/$/, '');
    console.log('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      var explorerPath = app.get('loopback-component-explorer').mountPath;
      console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function(err) {
  if (err) throw err;

  // get VCAP_APPLICATION enviroment variable
  /*var vcap_application = cfenv.getAppEnv();

  // check if running in local or CF mode
  if (vcap_application.isLocal == false) {
    // get service credentials by name
    var credentials = appEnv.getServiceCreds('training-db-service');

    var uri = credentials.uri;

    // reconfigure apiconnectdb loopback datasource with credentials
    app.datasources.apiconnectdb.adapter.settings.host = credentials.host;
    app.datasources.apiconnectdb.adapter.settings.port = credentials.port;
    app.datasources.apiconnectdb.adapter.settings.username = credentials.username;
    app.datasources.apiconnectdb.adapter.settings.password= credentials.password;
  }*/

  // start the server if `$ node server.js`
  if (require.main === module)
    app.start();
});
