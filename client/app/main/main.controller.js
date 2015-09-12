'use strict';

angular.module('seekdeerApp')
    .controller('MainCtrl', function($scope, $http, socket) {
        $scope.awesomeThings = [];

        $http.get('/api/things').then(function(response) {
            $scope.awesomeThings = response.data;
            socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.addThing = function() {
            if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', {
                name: $scope.newThing
            });
            $scope.newThing = '';
        };

        $scope.deleteThing = function(thing) {
            $http.delete('/api/things/' + thing._id);
        };

        $scope.$on('$destroy', function() {
            socket.unsyncUpdates('thing');
        });

        // accordion functions ======================================================
        $scope.oneAtATime = true;

        $scope.budget = {
            groupTitle: 'Budget',
            groupIcon: 'money',
            valueIcon: 'usd',
            defaultValue: '1000',
            slider: [{
                min: '50',
                max: '10000',
                step: '50'
            }]
        };

        $scope.where = {
            groupTitle: 'Where',
            groupIcon: 'globe',
            defaultValue: {
                'Tropical': true,
                'Forrest': true
            },
            categories: [{
                name: 'Tropical'
            }, {
                name: 'Snow'
            }, {
                name: 'Rain'
            }, {
                name: 'Forrest'
            }]
        };
        
        $scope.when = {
            groupTitle: 'When',
            groupIcon: 'calendar',
            defaultValue: new Date(),
            minDate: new Date()-1,
            maxDate: new Date().setFullYear(new Date().getFullYear()+2),
            showweeks: false,
            mode: "month"
        };

        $scope.showSelected = function(input) {
          //console.log(input)
          var object=[];
            for (var o in input) {
                if (input[o]) {
                    object.push(o);
                }
            }
            return object;
        };

        

        $scope.getCurrentValue=function(){
             if ($scope.newThing === '') {
                return;
            }
            $http.post('/api/things', {
                name: $scope.budget.defaultValue +" "+$scope.showSelected($scope.where.defaultValue)+" "+$scope.dt
            });
            $scope.newThing = '';
        };

        // End accordion functions ======================================================

						// google maps
						$scope.map = { 
							center: { latitude: 45, longitude: -73 }, 
							zoom: 8,
							options: {
							    draggable: false,
							    scrollwheel: false,
							    disableDefaultUI: true,
							    mapTypeId: google.maps.MapTypeId.TERRAIN
							}
						};
						
						$scope.map.markers = [
						{
							id : 1,
							latitude: 43.67023,
							longitude: -79.38676
					    },
					    {
							id : 2,
							latitude: 43.67023,
							longitude: -81.38676
					    },
					    {
							id : 3,
							latitude: 43.67023,
							longitude: -80.38676
					    }
					    ];

    });