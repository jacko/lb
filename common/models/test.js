'use strict';

var passport = require('passport');
var SamlStrategy = require('passport-saml').Strategy;
var session = require('express-session');

module.exports = function(Test) {

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
            {
            id: profile['nameID'],
            email: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
            displayName: profile['http://schemas.microsoft.com/identity/claims/displayname'],
            firstName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'],
            lastName: profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname']
            });
        })
    );

    Test.login = function(cb) {

        return passport.authenticate('saml', {
            successRedirect: '/check',
            failureRedirect: '/',
            failureFlash: true });

    };

    Test.remoteMethod('login', {
        http: { path: '/login', verb: 'get' },
        returns: { type: 'object', root: true }
    });


    Test.loginCallback = function(cb) {
        cb(null, 'ok');
    };

    Test.remoteMethod('loginCallback', {
        http: { path: '/login/cb', verb: 'post' },
        returns: { type: 'object', root: true }
    });

};
