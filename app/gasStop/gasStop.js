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
        var googleLoaded = false;

        $scope.makeGraph = function() {
            console.log("Making graph for fuel economy data");
            console.log($scope.gasStops);

            /*var gdat = new google.visualization.DataTable();
            gdat.addColumn('number', 'MPG');
            gdat.addColumn('number', 'odometer'); */

            var daters = [];

            $scope.gasStops.forEach(function(d) {
                if(!isNaN(d.milesPerGallon)) {
                    daters.push({"c": [{"v": d.odometer}, {"v": d.milesPerGallon}]});
                }
            });

            /*var options = {
                chart: {
                    title: 'Fuel Economy',
                    subtitle: 'Over your past 10 gas stops'
                },
                width: 900,
                height: 500
            };

            var chart = new google.charts.Line(document.getElementById('graph'));

            chart.draw(gdat, options); */

            ////this makes the graph
            $scope.graph = {
                "type": "LineChart",
                "displayed": true,
                "data": {
                    "cols": [
                        {
                            "id": "odometer",
                            "label": "Odometer",
                            "type": "number",
                            "p": {}
                        },
                        {
                            "id": "mpg",
                            "label": "Miles per Gallon",
                            "type": "number",
                            "p": {}
                        }
                    ],
                    "rows": daters
                },
                "options": {
                    "title": "Fuel Economy",
                    "isStacked": "true",
                    "fill": 20,
                    "displayExactValues": false,
                    "vAxis": {
                        "title": "MGP",
                        "gridlines": {
                            "count": 8
                        }
                    },
                    "hAxis": {
                        "title": "Odometer"
                    }
                },
                "formatters": {}
            }
        };

        /// get the data
        $http.get(EndpointService.makeEndpoint('gasStopService'), null, '')
            .success(function(data, status, headers, config) {
                if(data['responseType'] == 'gasStopsResponse') {
                    $scope.gasStops = data['values'];
                    $scope.makeGraph();
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
    }]);

