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
/*
		$scope.map = { 
			center: { latitude: 45, longitude: -73 }, 
			zoom: 4
		};
								
		$scope.map.markers = [];
*/
	    
	    uiGmapGoogleMapApi.then(function(maps) {
		    var map = new google.maps.Map(document.getElementById('testmap'), {
			    center: {lat: -33.8688, lng: 151.2195},
			    zoom: 13
			  });
			  
			  var marker = new google.maps.Marker({
			    map: map,
			    anchorPoint: new google.maps.Point(0, -29)
			  });
		    
		    
			var input = document.getElementById('searchTextField');
			var options = {types: ['(cities)']};
/*
			var map = $scope.map;
			var marker = $scope.map.markers;
*/
			
			var autocomplete = new google.maps.places.Autocomplete(input, options);	
			
			// event handler for autocomplete change
			google.maps.event.addListener(autocomplete, 'place_changed', function() {
				var place = autocomplete.getPlace();
				
/*
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
						$scope.map.markers = [];
						$.each(data.HotelListResponse.HotelList.HotelSummary, function(k, v) {
							//console.log('id: ' + v.hotelId + ' latitude: ' + v.latitude + ' longitude: ' + v.longitude);
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
*/
				
				
				if (place.geometry.viewport) {
			      map.fitBounds(place.geometry.viewport);
			    } else {
			      map.setCenter(place.geometry.location);
			      map.setZoom(17);  // Why 17? Because it looks good.
			    }
				

				
				
						
				
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