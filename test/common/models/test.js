'use strict';
/*
var passport = require('passport');
var SamlStrategy = require('passport-azure-ad').SamlStrategy;

passport.use(new SamlStrategy({
    identityMetadata: 'https://login.microsoftonline.com/13aa2ace-854b-499c-a0c8-296b82eac95a/federationmetadata/2007-06/federationmetadata.xml',
    loginCallback: 'https://voytik.azurewebsites.net/api/test/loginCallback/',
    logoutCallback: 'https://voytik.azurewebsites.net/api/test/logoutCallback/',
    issuer: 'https://voytik.azurewebsites.net',
    appUrl: 'https://voytik.azurewebsites.net',
  //  privateCert: fs.readFileSync('./private.pem', 'utf-8'),
  //  publicCert: fs.readFileSync('./public.pem', 'utf-8')
}, function(profile, done) {
    // when authenticated, simply hold profile in session
    process.nextTick(function () {
    done(null, profile);
    });
}));
*/

module.exports = function(Test) {

    Test.login = function(cb) {

        //passport.authenticate('saml');
        cb(null, 'ok');
    };

    Test.remoteMethod('login', {
        http: { path: '/login', verb: 'get' },
        returns: { type: 'object', root: true }
    });


    Test.loginCallback = function(cb) {
        cb(null, 'ok');
    };

    Test.remoteMethod('loginCallback', {
        http: { path: '/loginCallback', verb: 'post' },
        returns: { type: 'object', root: true }
    });

};
