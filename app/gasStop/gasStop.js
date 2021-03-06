'use strict';

angular.module('economizer.gasStop', ['ngCookies', 'ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/addGasStop', {
            templateUrl: 'gasStop/addGasStop.html',
            controller: 'AddGasStopCtrl'
        })
        .when('/fuelEconomy', {
            templateUrl: 'gasStop/fuelEconomyReport.html',
            controller: 'FuelEconomyReportController'
        });
    }])

    .controller('AddGasStopCtrl', ['$scope', '$http', '$location', 'EndpointService', 'SessionService', '$analytics', function($scope, $http, $location, EndpointService, SessionService, $analytics) {

        console.log(SessionService.get());

        ///redirect if not logged in
        if(!SessionService.get())
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
        $http.defaults.headers.common.Authorization = SessionService.get();

        $scope.gasStop = {};
        $scope.populateVehicles = function() {
            $scope.vehicles = [];

            $http.get(EndpointService.makeEndpoint('vehiclesService'))
                .success(function(data, status, headers, config) {
                    if(status==401) {
                        SessionService.clear();
                        $location.path("/login");
                        return;
                    }

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

            $http.post(EndpointService.makeEndpoint('gasStopService'), data, '')
                .success(function(data, status, headers, config) {
                    console.log(data);

                    if(data['responseType'] == 'gasStopAddedResponse') {
                        alert('Gas Stop added!');
                        $scope.gasStop = {};
                        $analytics.eventTrack('Gas Stop Added', {  category: 'Basic Usage', label: 'Gas Stop Added' });
                        $location.path("/fuelEconomy");
                    }
                    else if(data['responseType'] == 'errorResponse') {
                        $scope.error = data['errorMessage'];
                    }
                })
                .error(function(data, status, headers, config) {
                    if(data.responseType=='errorResponse')
                        $scope.error = data.errorMessage;
                    else
                        $scope.error = 'Unable to connect';
                });


        };

        $scope.addGasStop = function() {

        }

    }])

    .controller('FuelEconomyReportController', ['$http', '$scope', '$location', 'EndpointService', 'SessionService', function($http, $scope, $location, EndpointService, SessionService) {

        ///redirect if not logged in
        if(!SessionService.get())
            $location.path('/login');

        $scope.gasStops = [];
        $scope.average_mpg = "";
        var dataPoints = Math.floor(window.innerWidth/75);
        if(dataPoints < 3)
            dataPoints = 3;

        console.log("This many: "+dataPoints);

        $scope.makeGraph = function() {
            console.log("Making graph for fuel economy data");
            console.log($scope.gasStops);

            var points = [], labels = [];
            var highest_mpg = 0;

            $scope.gasStops.forEach(function(d) {
                if(!isNaN(d.milesPerGallon)) {
                    labels.push(d.odometer);
                    points.push(d.milesPerGallon);
                    if(d.milesPerGallon > highest_mpg) {
                        highest_mpg = d.milesPerGallon;
                        console.log("Setting highestMPG to: "+highest_mpg)
                    }
                }
            });

            labels.push('x');
            points.push('mpg');

            labels.reverse();
            points.reverse();

            var chart = c3.generate({
                bindto: '#graph',
                data: {
                    x: 'x',
                    columns: [
                        labels,
                        points
                    ],
                    type: 'spline'
                },
                axis: {
                    y: {
                        max: 50,    ///use highest_mpg here
                        min: 0,
                        padding: 0
                    }
                }

            });

        };

        /// get the data
        $http.get(EndpointService.makeEndpoint('fuelEconomyReportService'), null, '')
            .success(function(data, status, headers, config) {
                console.log("Success");
                if(data['responseType'] == 'fuelEconomyReportResponse') {
                    console.log(data);
                    $scope.gasStops = data.gasStops;
                    $scope.average_mpg = Math.round(data.average_mpg);
                    console.log($scope.average_mpg);
                    $scope.stop_frequency = Math.round(data.frequency);
                    console.log($scope.stop_frequency)
                    $scope.makeGraph();
                }
                else if(data['responseType'] == 'errorResponse') {
                    $scope.error = data['errorMessage'];
                }
                else {
                    $scope.error = "Invalid response";
                }
            })
            .error(function(data, status, headers, config) {
                if(data.responseType=='errorResponse')
                    $scope.error = data.errorMessage;
                else
                    $scope.error = 'Unable to connect';
            });

        $scope.tabClasses= ["active", "", ""];
        var defaultTabs = ["","",""];

        $scope.switchTab = function(tab) {
            $scope.tabClasses = defaultTabs.slice();
            $scope.tabClasses[tab] = "active";

        };
    }]);

