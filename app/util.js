'use strict';

console.log('loading endpoints module');

angular.module('economizer.utils', [])

    .factory('EndpointService', function() {

        var endpoints = {
                'api_path': '/api/v0',
                'loginService': '/login/',
                'vehiclesService': '/vehicles/',
                'addGasStopService': '/addGasStop/',
                'userService': '/user/',
                'resetPasswordService': '/resetPassword/',
                'makeEndpoint': function(service) {
                    return this['base']+ this['api_path'] + this[service];
            }
        };

        if(window.location.href.match(/localhost:/))
            endpoints['base'] = 'http://localhost:8000';
        else
            endpoints['base'] = 'https://economizer.dorthu.com';


        return endpoints;
});