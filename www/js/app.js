

var app = angular.module('MainActivity', ['ionic']);

 // configure our routes
    /*app.config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/', {
                templateUrl : 'main_menu.html',
                controller  : 'main_activity'
            })

            // route for the visual page
            .when('/visual', {
                templateUrl : 'visual.html',
                controller  : 'visualController'
            });
    });*/
	
	//----------------------------------hybrid app configuration------------------------------------------------- 
	app.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $stateProvider
            .state('home', {
                url: '/',
                templateUrl: 'main_menu.html',
                controller: 'main_activity'
            })
            .state('visual', {
                url: '/visual',
                templateUrl: 'visual.html',
                controller: 'visualController'
            })
			.state('gmap', {
                url: '/gmap',
                templateUrl: 'gmap.html',
                controller: 'gmapController'
            })
			.state('leaflet', {
                url: '/leaflet',
                templateUrl: 'leaflet.html',
                controller: 'leafletController'
            });
			$urlRouterProvider.otherwise('/');
			
			//saves up a bit of time, prevents "scrolling in progress" issue
			$ionicConfigProvider.views.transition('none');
    });


	//this service is needed to connect the visualController with the main controller
	app.service('timeService', function($http) {
		var visual_start="";
		var get_visual_start = function(){return visual_start;};
		var set_visual_start = function(start){visual_start=start;};
		var timer = function(taskType, time){
									var obj = {task : taskType, execution : time, platform : 'HYBRID'};
									$http.post("http://83.212.86.247/thesis/test.php", obj)
									.then(function(response){}
									,function(response){});
								 };
		
		return{
			get_visual_start : get_visual_start,
			set_visual_start : set_visual_start,
			timer : timer
		};
	});
	
	app.controller('visualController', function($ionicPlatform, $location, $scope, $http, timeService) {
		
		
		//back button functionality - doesnt kill the app anymore while Visual tab is active
		var defaultBack = $ionicPlatform.registerBackButtonAction(function(){
			$location.path("/");
			$scope.$apply();
			}, 101
		);
		
		//when leaving the Visual Tab, back button default functionality is restored
		$scope.$on('$destroy', function() {
			defaultBack();
		});
		
		//when the document is ready (layout has been applied)
		angular.element(document).ready(function () {
			console.log("doc ready event!!!! " + timeService.get_visual_start());
			
			var time_scrn_chng = new Date().getTime() - timeService.get_visual_start();
			console.log("Visual here!!!! " + time_scrn_chng);
			
			timeService.timer("SCR_CHNG", time_scrn_chng);
		});
		
		$scope.range = function(min, max){
			
			var iter = [];
			for (var i = min; i <= max; i += 1) {
				iter.push(i);
			}
			return iter;
			
			};
        
			
		
    });

	
	app.controller('gmapController', function($ionicPlatform, $location, $scope, $ionicModal, $http, $state, timeService) {
		
		//back button functionality - doesnt kill the app anymore while Visual tab is active
		var defaultBack = $ionicPlatform.registerBackButtonAction(function(){
			$location.path("/");
			$scope.$apply();
			}, 101
		);
		
		//when leaving the Visual Tab, back button default functionality is restored
		$scope.$on('$destroy', function() {
			defaultBack();
		});
									
		$scope.map_init_time = "";
									
		var center = {coords : {latitude : 38.246639, longitude : 21.734573}};
									
		//otan ta dedomena metatrepontai se json format, o kwdikas den paizei
									
		$http.get("http://83.212.86.247/thesis/getshops.php")
				.then(function(response){  $scope.onGeoSuccess(center, response.data, this); }
				,function(response){});
		
		$scope.onGeoSuccess = function(position, shops, parentScope) {
		
		//we start counting
		var start = new Date().getTime();
		
        //center of the maps is in Patras
		var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
		
		
 
		var mapOptions = {
			center: latLng,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
 
		//the map is created - when it loads, 'idle' event is fired
		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		
		
		//Wait until the map is loaded
		google.maps.event.addListenerOnce($scope.map, 'idle', function(){
			
			
			
			//pinakas markers
			//var markers[];
			var markers = new Array(100);
			
			//var start = new Date().getTime();
			for(var i = 0; i < 100; i++){
				
				var lat_lng = new google.maps.LatLng(shops[i].lat, shops[i].lon);
				
				markers[i] = new google.maps.Marker({
					position: lat_lng
				});
				
				    
			}
			//var time_init = new Date().getTime() - start;
			//console.log("Map init time: " + time_init);
			
			
			//var start = new Date().getTime();
			for(var i = 0; i < 100; i++){
				markers[i].setMap($scope.map);
				     
			}
			var time_init = new Date().getTime() - start;
			//console.log("Map init time: " + time_init);
			$scope.$apply();
			//$scope.timer("GMAP_INIT", time_init);
			timeService.timer("GMAP_INIT", time_init);
			$scope.map_init_time = time_init;
			
		});
		
		//return time_init;
		
    };
	
	
	
	});	
	
	app.controller('leafletController', function($ionicPlatform, $location, $scope, $http, timeService) {
		
		
		//back button functionality - doesnt kill the app anymore while Visual tab is active
		var defaultBack = $ionicPlatform.registerBackButtonAction(function(){
			$location.path("/");
			$scope.$apply();
			}, 101
		);
		
		//when leaving the Visual Tab, back button default functionality is restored
		$scope.$on('$destroy', function() {
			defaultBack();
		});
		
		var center = {coords : {latitude : 38.246639, longitude : 21.734573}};
									
		$http.get("http://83.212.86.247/thesis/getshops.php")
			.then(function(response){ $scope.onGeoSuccessLeaflet(center, response.data); }
			,function(response){});
			
		
		$scope.onGeoSuccessLeaflet = function(position, shops) {
		
		if($scope.leaf_map == ""){
			var start = new Date().getTime();
			$scope.leaf_map = L.map('leaf_map');
			
			//map.on "load" is fired when setView executes. we want to measure the map init time 
			$scope.leaf_map.on("load", function(){
				var markers = new Array(100);
				
				L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
				attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
				maxZoom: 18,
				id: 'mapbox.streets',
				accessToken: 'pk.eyJ1IjoiYmlsbHRzIiwiYSI6ImNpcmMweDE3eTAwNmVpa25udjgxNWNtc3MifQ.dQaFufbf1N_440j8yKVTPA'
				}).addTo($scope.leaf_map);
				
				for(var i = 0; i < 100; i++){
				
					markers[i] = L.marker([shops[i].lat, shops[i].lon]);
			
				}
				
				for(var i = 0; i < 100; i++){
				
					markers[i].addTo($scope.leaf_map);
			
				}
				
				var time_init = new Date().getTime() - start;
				//console.log("Lealfet Map init time: " + time_init);
				timeService.timer("LEAFMAP_INIT", time_init);
			});
			
			$scope.leaf_map.setView([position.coords.latitude, position.coords.longitude], 13);
		
			
		}
			
        
    };	
		
    });
		
	
	app.controller('main_activity', function($scope, $ionicModal, $http, $state, timeService) {

	/*------------JSON GET MODAL----------------------------------------*/

	$ionicModal.fromTemplateUrl('jsonModal.html', function(modal) {
    $scope.jsonModal = modal;
  }, {
    scope: $scope,
    animation: 'none'
  });
  

  /*------------JSON POST MODAL----------------------------------------*/
  $ionicModal.fromTemplateUrl('jsonModalPost.html', function(modal) {
    $scope.jsonModalPost = modal;
  }, {
    scope: $scope,
    animation: 'none'
  });
  
  /*------------GOOGLE MAPS MODAL----------------------------------------*/
	/*$ionicModal.fromTemplateUrl('GMAPModal.html', function(modal) {
    $scope.GMAPModal = modal;
  }, {
    scope: $scope,
    animation: 'none'
  });*/
  
  /*------------LEAFLET MAPS MODAL----------------------------------------*/
	/*$ionicModal.fromTemplateUrl('LeafletModal.html', function(modal) {
    $scope.LeafletModal = modal;
  }, {
    scope: $scope,
    animation: 'none'
  });*/
  
  $scope.details="";
  $scope.result="";
  $scope.time="";
  
  $scope.POSTresult="";
  $scope.POSTtime="";
  $scope.formData={};
  
  $scope.stats="";
  
  $scope.noOfshops="";
  
  //$scope.map_init_time="";
  
  $scope.visual_start="";
  
  $scope.leaf_map="";
  
  

	
	$scope.showJson = function(){
									$scope.jsonModal.show();
									$scope.GETJson();
								 };
	$scope.hideJson = function(){
									$scope.jsonModal.hide();
								 };

	$scope.showJsonPost = function(){
									$scope.jsonModalPost.show();
								 };
	$scope.hideJsonPost = function(){
									$scope.jsonModalPost.hide();
								 };
	$scope.showGMAP = function(){
									//$scope.GMAPModal.show();
									$state.go('gmap');
									
								 };
	$scope.hideGMAP = function(){
									$scope.GMAPModal.hide();
								 };
	$scope.showLeaflet = function(){
									$state.go('leaflet');
								 };
	$scope.hideLeaflet = function(){
									$scope.LeafletModal.hide();
								 };
	$scope.showVisual = function(){
									timeService.set_visual_start(new Date().getTime());
									//$state.go('visual');
								 };
	/*$scope.hideVisual = function(){
									$scope.VisualModal.hide();
								 };*/
	$scope.GETJson = function(){
									var start = new Date().getTime();
									$http.get("http://83.212.86.247/thesis/test1.php")
									.then(function(response){ $scope.result = response.data; $scope.time = new Date().getTime() - start; timeService.timer("GET_JSON", $scope.time);}
									,function(response){ $scope.result = response.status; $scope.time = new Date().getTime() - start;});
									
									
								 };
								 
	$scope.POSTJson = function(){
									//var start = new Date().getTime();
									var obj = {name : $scope.formData.username, pwd : $scope.formData.pwd};
									var start = Date.now();
									$http.post("http://83.212.86.247/thesis/test.php", obj)
									.then(function(response){ $scope.POSTresult = response.data; $scope.POSTtime = new Date().getTime() - start; timeService.timer("POST_JSON", $scope.POSTtime);}
									,function(response){ $scope.POSTresult = response.status; $scope.POSTtime = new Date().getTime() - start;});
									
									
								 };

    
    $scope.onGeoError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };
});
