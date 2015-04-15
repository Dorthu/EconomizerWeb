'use strict';

// Declare app level module which depends on views, and components
angular.module('ecnonmizer', [
  'ngCookies',
  'ngRoute',
  'economizer.utils',
  'economizer.login',
  'economizer.gasStop',
  'economizer.resetPassword',
  'mobile-angular-ui',
  'mobile-angular-ui.components'
])

.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'home/home.html'
    });
    $routeProvider.otherwise({redirectTo: '/index'});
}])

.run(['$http', '$rootScope', '$location', 'EndpointService', '$cookies', function($http, $rootScope, $location, EndpointService, $cookies) {
    ///intialize the user
    if($cookies['token']) {
        $http.defaults.headers.common.Authorization = $cookies['token'];

        $http.get(EndpointService.makeEndpoint('userService'))
            .success(function(data, status, headers, config) {
                if(status==200) {
                    $rootScope.user = data;

                    if($rootScope.user.needsPasswordReset)
                        $location.path('/resetPassword');
                }
                else if(status==401) {
                    delete $cookies['token'];
                    $location.path('/login');
                }
            })
            .error(function(data, status, headers, config) {
                delete $cookies['token'];
                $location.path('/login');
            });
    }
}])

.controller('SidebarCtrl', ['$scope', '$http', function($scope, $http) {
    ///setup the known issues in the sidebar
    $scope.knownIssues = [];

    $http.get("https://api.github.com/repos/Dorthu/FuelEconomizer/issues?labels=bug", '', '')
        .success(function(data, status, headers, config) {
            $scope.knownIssues = $scope.knownIssues.concat(data);
        });

    $http.get("https://api.github.com/repos/Dorthu/EconomizerWeb/issues?labels=bug", '', '')
        .success(function(data, status, headers, config) {
            $scope.knownIssues = $scope.knownIssues.concat(data);
        });
}]);
