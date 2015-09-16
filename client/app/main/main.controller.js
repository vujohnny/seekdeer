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
	    uiGmapGoogleMapApi.then(function(maps) {
		    
		    // init google maps and set options
		    var map;
		    var bounds = new google.maps.LatLngBounds();
		    var mapOptions = {
			    center: {lat: -33.8688, lng: 151.2195},
			    zoom: 4,
		        mapTypeId: 'roadmap'
		    };

		                    
		    // Display a map on the page
		    map = new google.maps.Map(document.getElementById("googleMap"), mapOptions);		    		
			
		    
		    // set autocomplete on input field
			var input = document.getElementById('searchTextField');
			var options = {types: ['(cities)']};
			
			var autocomplete = new google.maps.places.Autocomplete(input, options);	
			
			// event handler for autocomplete change
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				
				var place = autocomplete.getPlace().formatted_address;
				//formatted_address
				
			    // expedia hotel list call
			    var apiKey = '70303auc6h8hqutunreio3u8pl',
					cid = '55505',
					minorRev = '99',
					locale = 'en_US',
					curencyCode = 'USD',
					destinationString = place,
					arrivalDate = '10/10/2015',
					departureDate = '10/20/2015',
					room = '2';
				
				$.ajax({
					type: 'GET',
					url: 'http://api.ean.com/ean-services/rs/hotel/v3/list?locale='+ locale +'&destinationString='+ destinationString +'&apiKey='+  apiKey+'&minorRev='+  minorRev+'&departureDate='+ departureDate +'&room='+ room +'&arrivalDate='+ arrivalDate +'&curencyCode='+ curencyCode +'&cid='+ cid +'',
					async: false,
					contentType: "application/json",
					dataType: 'jsonp',
					
					success: function(data){
						console.log(data);
						$scope.map.markers = [];
						$.each(data.HotelListResponse.HotelList.HotelSummary, function(k, v) {
							console.log('id: ' + v.hotelId + ' latitude: ' + v.latitude + ' longitude: ' + v.longitude);
							$scope.map.markers.push({
									id: v.hotelId, 
									latitude: v.latitude, 
									longitude: v.longitude
								});
						});
						console.log($scope.map.markers);
					
					},
					
					error: function(e){
						console.log(e.message);
					}
				});
				
				
				// sets single place from autocomplete
				if (place.geometry.viewport) {
					map.fitBounds(place.geometry.viewport);
				} 
				else {
					map.setCenter(place.geometry.location);
					map.setZoom(17);
				}
				
				
				// set multiple markers
/*
				var markers = [
					['London Eye, London', 51.503454, -0.119562],
					['Palace of Westminster, London', 51.499633, -0.124755]
				];
				
				var infoWindow = new google.maps.InfoWindow(), marker, i;			
				for( i = 0; i < markers.length; i++ ) {
				    var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
				    bounds.extend(position);
				    marker = new google.maps.Marker({
				        position: position,
				        map: map,
				        title: markers[i][0]
				    });
				
				    // Automatically center the map fitting all markers on the screen
				    map.fitBounds(bounds);
				}	
*/
				

				
				
						
				
			});
			
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