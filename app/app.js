'use strict';

// Declare app level module which depends on views, and components
angular.module('ecnonmizer', [
  'ngCookies',
  'ngRoute',
  'angulartics',
  'angulartics.google.analytics',
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

.run(['$http', '$rootScope', '$location', 'EndpointService', 'SessionService', function($http, $rootScope, $location, EndpointService, SessionService) {
    ///intialize the user
    if(SessionService.get()) {
        $http.defaults.headers.common.Authorization = SessionService.get();

        $http.get(EndpointService.makeEndpoint('userService'))
            .success(function(data, status, headers, config) {
                if(status==200) {
                    $rootScope.user = data;

                    if($rootScope.user.needsPasswordReset)
                        $location.path('/resetPassword');
                }
                else if(status==401) {
                    SessionService.clear();
                    $location.path('/login');
                }
            })
            .error(function(data, status, headers, config) {
                SessionService.clear();
                $location.path('/login');
            });
    }
}])

///configure charts
.run(function() {
    Chart.defaults.global.responsive = true;
    Chart.maintainAspectRatio = true;
})

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
