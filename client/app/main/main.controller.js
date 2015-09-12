'use strict';

angular.module('seekdeerApp')
    .controller('MainCtrl', function($scope, $http, socket, uiGmapGoogleMapApi) {
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
            defaultValue: 'Today'
        };
        
						// current date
						$scope.today = function() {
							$scope.dt = new Date();
						};
						$scope.today();
						
						// min date ***need this so user can't select days past
						$scope.toggleMin = function() {
							$scope.minDate = $scope.minDate ? null : new Date();
						};
						$scope.toggleMin();
						
						// max date
						$scope.maxDate = new Date(2020, 5, 22);
						
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
					    
					    
					    uiGmapGoogleMapApi.then(function(maps) {
							var input = document.getElementById('searchTextField');
							var options = {types: ['(cities)']};
							var map = $scope.map;
						
							var autocomplete = new google.maps.places.Autocomplete(input, options);	
					    });
					

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
              

    });