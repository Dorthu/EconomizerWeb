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
config(['$routeProvider', function($routeProvider, $cookies) {
  $routeProvider.otherwise({redirectTo: '/login'});
}]);
