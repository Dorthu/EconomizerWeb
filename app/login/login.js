'use strict';

angular.module('ecnonmizer.login', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: 'login/login.html',
            controller: 'LoginCtrl'
        });
    }])

    .controller('LoginCtrl', ['$scope', '$http', '$cookies', '$location', function($scope, $http, $cookies, $location) {

        console.log($cookies['token']);
        if($cookies['token'])
            $location.path('/addGasStop');

        $scope.login = function() {
            console.log($scope.user);

            $http.post("http://localhost:8000/webservices/login/", $scope.user, '')
                .success(function(data, status, headers, config) {
                    console.log(data);

                    if(data['responseType']=='loginResponse') {
                        $cookies['token'] = data['token'];
                        $location.path('/addGasStop');
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
