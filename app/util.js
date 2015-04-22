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
    })

    .factory('SessionService', ['$cookies', function($cookies) {
        return {
            get: function() {
                if (typeof(Storage) !== 'undefined') {
                    return localStorage.getItem('token');
                }
                else {
                    return $cookies['token'];
                }
            },
            set: function(token) {
                if(typeof(Storage) !== 'undefined') {
                    localStorage.setItem('token', token);
                }
                else {
                    $cookies['token'] = token;
                }
            },
            clear: function() {
                if(typeof(Storage) !== 'undefined') {
                    localStorage.removeItem('token');
                }
                else {
                    delete $cookies['token'];
                }
            }
        };
    }]);