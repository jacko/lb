'use strict';

module.exports = function(Test) {

    Test.login = function(cb) {

        cb(null, 'ok');
        
    };

    Test.remoteMethod('login', {
        http: { path: '/login', verb: 'get' },
        returns: { type: 'object', root: true }
    });

};
