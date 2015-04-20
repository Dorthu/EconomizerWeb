'use strict';

angular.module('economizer.login', ['ngCookies', 'ngRoute', 'economizer.utils'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$http', '$cookies', '$location', 'EndpointService', function($scope, $http, $cookies, $location, EndpointService) {

        console.log($cookies['token']);
        if($cookies['token'])
            $location.path('/addGasStop');

        $scope.login = function() {
            console.log($scope.user);

            $http.post(EndpointService.makeEndpoint('loginService'), $scope.user, '')
                .success(function(data, status, headers, config) {
                    console.log(data);

                    if(data['responseType']=='loginResponse') {
                        $cookies['token'] = data['token'];
                        location.reload();
                    }
                    else if(data['responseType'] == 'errorResponse') {
                        $scope.error = data['errorMessage'];
                        $scope.user.password='';
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.error = 'Unable to Connect';
                });
        };

    }]);
