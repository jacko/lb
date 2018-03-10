var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var passport = require('passport');
var session = require('express-session');
var fs = require('fs');

var SamlStrategy = require('passport-saml').Strategy;
passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new SamlStrategy(
  {
    path: '/login/cb',
    protocol: "https://",
    entryPoint: 'https://login.microsoftonline.com/13aa2ace-854b-499c-a0c8-296b82eac95a/saml2',
    issuer: 'mytestapp',
    cert: "MIIC8DCCAdigAwIBAgIQe51RDONO1rdLMdQZkYWX/zANBgkqhkiG9w0BAQsFADA0MTIwMAYDVQQDEylNaWNyb3NvZnQgQXp1cmUgRmVkZXJhdGVkIFNTTyBDZXJ0aWZpY2F0ZTAeFw0xODAzMDkyMDUxNDhaFw0yMTAzMDkyMDUxNDhaMDQxMjAwBgNVBAMTKU1pY3Jvc29mdCBBenVyZSBGZWRlcmF0ZWQgU1NPIENlcnRpZmljYXRlMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsRmbPuH+twjpi2s4rKoE+pFpcdCzKWcLBzpu5wOvctHTvKzUS9eOja08qXvD1clndMChsX/7jObeRRMW/FQPWjf5o44md9j8jIdZW3Dthy3AqZSBVNQ4cLc1LsKAm1OgQrgmX+VTIFfTFTxSsH73D4O210EddIGFHnEzhRt2DndxC8E7xOg6MYLIkgOgPmnucvo88OwKEHl6OmKAN1Z1AyjI20tX5QmwOpRVd/+vwCA09MLsJzxRsq6m59bXQcCnHHjXPtBNCSHOCvYLFInwl/iKJYcSVtBVlJMWoX2ripia/kOEaHN/TO1H+sk6ALkkMPQgvEWSaWGXigXxaOrAWQIDAQABMA0GCSqGSIb3DQEBCwUAA4IBAQAJZH8G1/mbtLvPpgX/kPk7MfPPGlmaJG2wPz5ODNXPuQmOo2diRpQY2PRswm844AV/ModBhP7eRw4WhGcisdXUPrDIRUZCO4YkdqI+Gzfer6+O08I0Z6Q5E3yWeCN7covcV+2tzwxrUyc1Zb3rQlkiao6gAiIX7VedkOnTjh7mBGbiEyIot/jyA+cQQNMT1q1+DLyaIaaGmPWnSxSOwv5vRkn8sB77ikZQuuQzx72p8ohamwXvvudIc8iYZyFqVVU8KbiG33/0J5wHQOYxrBpnL49sPTLOg+4OGkdwzr8iwVWVhJhhgWR8uXMruvN7lqF//I6SVtB6lA1I8zTN3LQQ",
    signatureAlgorithm: 'sha256'
  },
  function(profile, done) {
    return done(null,
    {
      id: profile['nameID'],
      email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
      firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
      lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
    });
  })
);


var index = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session(
  {
    resave: true,
    saveUninitialized: true,
    secret: 'this shit hits'
  }));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);


app.get('/login',
  passport.authenticate('saml', {
    successRedirect: '/',
    failureRedirect: '/login' })
  );
app.post('/login/cb',
  passport.authenticate('saml', {
    failureRedirect: '/',
    failureFlash: true }),
  function(req, res) {
    res.redirect('/');
  }
);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
