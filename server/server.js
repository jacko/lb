'use strict';

var loopback = require('loopback');
var boot = require('loopback-boot');

var app = module.exports = loopback();

var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var session = require('express-session');

var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var flash      = require('express-flash');

passport.use(new SamlStrategy(
  {
      callbackUrl: "https://voyt.pro:3001/login/cb",
      entryPoint: 'https://login.microsoftonline.com/13aa2ace-854b-499c-a0c8-296b82eac95a/saml2',
      issuer: 'mytestapp',
      cert: "MIIC8DCCAdigAwIBAgIQe51RDONO1rdLMdQZkYWX/zANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0xODAzMDkyMDUxNDhaFw0yMTAzMDkyMDUxNDhaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsRmbPuH+twjpi2s4rKoE+pFpcdCzKWcLBzpu5wOvctHTvKzUS9eOja08qXvD1clndMChsX/7jObeRRMW/FQPWjf5o44md9j8jIdZW3Dthy3AqZSBVNQ4cLc1LsKAm1OgQrgmX+VTIFfTFTxSsH73D4O210EddIGFHnEzhRt2DndxC8E7xOg6MYLIkgOgPmnucvo88OwKEHl6OmKAN1Z1AyjI20tX5QmwOpRVd/+vwCA09MLsJzxRsq6m59bXQcCnHHjXPtBNCSHOCvYLFInwl/iKJYcSVtBVlJMWoX2ripia/kOEaHN/TO1H+sk6ALkkMPQgvEWSaWGXigXxaOrAWQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAJZH8G1/mbtLvPpgX/kPk7MfPPGlmaJG2wPz5ODNXPuQmOo2diRpQY2PRswm844AV/ModBhP7eRw4WhGcisdXUPrDIRUZCO4YkdqI+Gzfer6+O08I0Z6Q5E3yWeCN7covcV+2tzwxrUyc1Zb3rQlkiao6gAiIX7VedkOnTjh7mBGbiEyIot/jyA+cQQNMT1q1+DLyaIaaGmPWnSxSOwv5vRkn8sB77ikZQuuQzx72p8ohamwXvvudIc8iYZyFqVVU8KbiG33/0J5wHQOYxrBpnL49sPTLOg+4OGkdwzr8iwVWVhJhhgWR8uXMruvN7lqF//I6SVtB6lA1I8zTN3LQQ",
      signatureAlgorithm: 'sha256'
  },
  function(profile, done) {
      return done(null,
      profile);
  })
);

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: 'this shit hits'
  }));
  app.use(passport.initialize());
  app.use(passport.session());


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
boot(app, __dirname);

// to support JSON-encoded bodies
app.middleware('parse', bodyParser.json());
// to support URL-encoded bodies
app.middleware('parse', bodyParser.urlencoded({
  extended: true,
}));

app.middleware('session:before', cookieParser(app.get('cookieSecret')));
app.middleware('session', session({
  secret: 'kitty',
  saveUninitialized: true,
  resave: true,
}));

// We need flash messages to see passport errors
app.use(flash());


app.get('/login',
  passport.authenticate('saml', {
    successRedirect: '/check',
    failureRedirect: '/login' })
  );


app.post('/login/cb',
  passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true }),
  function(req, res) {
    res.redirect('/check');
  }
);


app.get('/check', function(req, res, next) {
  if(req.isAuthenticated())
  {
    console.log(req);
    
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end( 'user' + req.user.displayName + ' | email: ' + req.user.email );
  }
  else
  {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.end("Not authorized ;(");
  }
});


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


// start the server if `$ node server.js`
if (require.main === module) {
  app.start();
}