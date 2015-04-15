'use strict';

angular.module('economizer.resetPassword', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/resetPassword', {
            templateUrl: 'passwordReset/resetPassword.html',
            controller: 'ResetPasswordCtrl'
        });
    }])

    .controller('ResetPasswordCtrl', ['$scope', '$http', '$cookies', '$location', 'EndpointService', function($scope, $http, $cookies, $location, EndpointService) {

        console.log($cookies['token']);

        ///redirect if not logged in
        if(!$cookies['token'])
            $location.path('/login');

        $scope.submit = function() {

            var data = $scope.passwordReset;

            $http.post(EndpointService.makeEndpoint('resetPasswordService'), data, '')
                .success(function(data, status, headers, config) {

                    if(status==200) {
                        if(data['responseType']=='loginResponse') {
                            $cookies['token'] = data['token'];
                            $location.path('/addGasStop');
                        }
                    }
                    else {
                        if(data['responseType'] == 'errorResponse')
                            $scope.error = data['errorMessage'];
                        else
                            $scope.error = "Error Processing Request";
                    }

                })
                .error(function(data, status, headers, config) {
                    $scope.error = "Unable to Connect";
                });
        }

    }]);