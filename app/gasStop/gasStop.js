'use strict';

angular.module('economizer.gasStop', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/addGasStop', {
            templateUrl: 'gasStop/addGasStop.html',
            controller: 'AddGasStopCtrl'
        });
    }])

    .controller('AddGasStopCtrl', ['$scope', '$http', '$cookies', '$location', 'EndpointService', function($scope, $http, $cookies, $location, EndpointService) {

        console.log($cookies['token']);

        ///redirect if not logged in
        if(!$cookies['token'])
            $location.path('/login');

        $scope.userLocation = { 'lat' : 0, 'lon' : 0 };
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                $scope.userLocation.lat = position.coords.latitude;
                $scope.userLocation.lon = position.coords.longitude;
                $scope.userLocation.accuracy = position.coords.accuracy;

                console.log($scope.userLocation);
            });
        }

        ///move this to a more general place that only happens once at startup
        $http.defaults.headers.common.Authorization = $cookies['token'];

        $scope.gasStop = {};
        $scope.populateVehicles = function() {
            $scope.vehicles = [];

            $http.get(EndpointService.makeEndpoint('vehiclesService'))
                .success(function(data, status, headers, config) {
                    console.log(data);
                    $scope.vehicles = data.vehicles;

                    for(var x=0; x<$scope.vehicles.length; x++) {
                        var item = $scope.vehicles[x];
                        console.log("Looking at item..");
                        console.log(item);
                        if(item.default) {
                            console.log(item);
                            $scope.gasStop.vehicle = item.vid;
                            break;
                        }
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.error = "Unable to connect";
                });
        };
        $scope.populateVehicles();

        $scope.submit = function() {

            ///validation
            $scope.gasStop.pricePaid = $scope.gasStop.pricePaid.replace('$', '');
            if(isNaN(parseFloat($scope.gasStop.pricePaid))) {
                $scope.error = "Price Paid is not a number!";
                return;
            }
            else if(isNaN(parseFloat($scope.gasStop.gallonsPurchased))) {
                $scope.error = "Gallons Purchased is not a number!";
                return;
            }
            else if(isNaN(parseInt($scope.gasStop.odometer))) {
                $scope.error = "Odometer reading is not an integer!";
                return;
            }
            else {
                $scope.error = undefined;
            }

            var data = $scope.gasStop;
            data.userLocation = $scope.userLocation;
            console.log(data);

            $http.post(EndpointService.makeEndpoint('addGasStopService'), data, '')
                .success(function(data, status, headers, config) {
                    console.log(data);

                    if(data['responseType'] == 'gasStopAddedResponse') {
                        alert('Gas Stop added!');
                        $scope.gasStop = {};
                    }
                    else if(data['responseType'] == 'errorResponse') {
                        $scope.error = data['errorMessage'];
                    }
                })
                .error(function(data, status, headers, config) {
                    $scope.error = 'Unable to connect';
                });


        };

        $scope.addGasStop = function() {

        }

    }]);

