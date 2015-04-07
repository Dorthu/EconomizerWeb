'use strict';

// Declare app level module which depends on views, and components
angular.module('ecnonmizer', [
  'ngCookies',
  'ngRoute',
  'economizer.utils',
  'economizer.login',
  'economizer.gasStop',
  'mobile-angular-ui',
  'mobile-angular-ui.components'
]).
config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/index', {
      templateUrl: 'home/home.html'
    });
    $routeProvider.otherwise({redirectTo: '/index'});
}])

.controller('SidebarCtrl', ['$scope', '$http', function($scope, $http) {
    ///pass
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
