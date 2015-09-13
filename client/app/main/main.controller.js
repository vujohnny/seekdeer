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
            console.log("inside getCurrentValue");
            console.log("inside getCurrentValue2");
            $http.post('/api/things', {
                name: $scope.budget.defaultValue +" "+$scope.showSelected($scope.where.defaultValue)+" "+$scope.when.defaultValue
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
	    
	    uiGmapGoogleMapApi.then(function(maps) {
			var input = document.getElementById('searchTextField');
			var options = {types: ['(cities)']};
			var map = $scope.map;
		
			var autocomplete = new google.maps.places.Autocomplete(input, options);	
	    });
	    
	    // hotel list call, expedia
		$.ajax({
			type: 'GET',
			url: 'https://book.api.ean.com/ean-services/rs/hotel/v3/list?locale=en_US&destinationString=las vegas,nv&apiKey=70303auc6h8hqutunreio3u8pl&minorRev=99&departureDate=10/20/15&room=2&arrivalDate=10/10/2015&curencyCode=USD&cid=55505',
			async: false,
			contentType: "application/json",
			dataType: 'jsonp',
			
			success: function(data){
				console.log(data);
			},
			
			error: function(e){
				console.log(e.message);
			}
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