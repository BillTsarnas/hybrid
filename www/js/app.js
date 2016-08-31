//includes all of the Ionic code which will process the tags

var app = angular.module('MainActivity', ['ionic']);



app.controller('main_activity', function($scope, $ionicModal, $http) {

	/*------------JSON GET MODAL----------------------------------------*/

	$ionicModal.fromTemplateUrl('jsonModal.html', function(modal) {
    $scope.jsonModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  

  /*------------JSON POST MODAL----------------------------------------*/
  $ionicModal.fromTemplateUrl('jsonModalPost.html', function(modal) {
    $scope.jsonModalPost = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  /*------------GOOGLE MAPS MODAL----------------------------------------*/
	$ionicModal.fromTemplateUrl('GMAPModal.html', function(modal) {
    $scope.GMAPModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  /*------------LEAFLET MAPS MODAL----------------------------------------*/
	$ionicModal.fromTemplateUrl('LeafletModal.html', function(modal) {
    $scope.LeafletModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  /*------------SCREEN CHANGE MODAL----------------------------------------*/
	$ionicModal.fromTemplateUrl('VisualModal.html', function(modal) {
    $scope.VisualModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  $scope.details="";
  $scope.result="";
  $scope.time="";
  
  $scope.POSTresult="";
  $scope.POSTtime="";
  $scope.formData={};
  
  $scope.stats="";

	
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
									$scope.GMAPModal.show();
									navigator.geolocation.getCurrentPosition($scope.onGeoSuccess, $scope.onGeoError);
								 };
	$scope.hideGMAP = function(){
									$scope.GMAPModal.hide();
								 };
	$scope.showLeaflet = function(){
									$scope.LeafletModal.show();
									navigator.geolocation.getCurrentPosition($scope.onGeoSuccessLeaflet, $scope.onGeoError);
								 };
	$scope.hideLeaflet = function(){
									$scope.LeafletModal.hide();
								 };
	$scope.showVisual = function(){
									var start = new Date().getTime();
									$scope.VisualModal.show();
									var time = new Date().getTime() - start;
									
									var obj = {task : "SCR_CHG", execution : time};
									
									$http.post("http://83.212.86.247/thesis/test.php", obj)
									.then(function(response){}
									,function(response){});
								 };
	$scope.hideVisual = function(){
									$scope.VisualModal.hide();
								 };
	$scope.GETJson = function(){
									var start = new Date().getTime();
									$http.get("http://83.212.86.247/thesis/test1.php")
									.then(function(response){ $scope.result = response.data; $scope.time = new Date().getTime() - start; $scope.timer("GET_JSON", $scope.time);}
									,function(response){ $scope.result = response.status; $scope.time = new Date().getTime() - start;});
									
									
								 };
								 
	$scope.POSTJson = function(){
									//var start = new Date().getTime();
									var obj = {name : $scope.formData.username, pwd : $scope.formData.pwd};
									var start = Date.now();
									$http.post("http://83.212.86.247/thesis/test.php", obj)
									.then(function(response){ $scope.POSTresult = response.data; $scope.POSTtime = new Date().getTime() - start; $scope.timer("POST_JSON", $scope.POSTtime);}
									,function(response){ $scope.POSTresult = response.status; $scope.POSTtime = new Date().getTime() - start;});
									
									
								 };
								 
	$scope.timer = function(taskType, time){
									var obj = {task : taskType, execution : time};
									
									$http.post("http://83.212.86.247/thesis/test.php", obj)
									.then(function(response){}
									,function(response){});
								 };
	
	$scope.onGeoSuccess = function(position) {
		
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
 
		var mapOptions = {
			center: latLng,
			zoom: 15,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
 
		$scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
		
		//Wait until the map is loaded
		google.maps.event.addListenerOnce($scope.map, 'idle', function(){
 
			var marker = new google.maps.Marker({
				map: $scope.map,
				animation: google.maps.Animation.DROP,
				position: latLng
			});      
 
		});
    };
	
	$scope.onGeoSuccessLeaflet = function(position) {
		var mymap = L.map('leaf_map').setView([position.coords.latitude, position.coords.longitude], 13);
		
		L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
			attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
			maxZoom: 18,
			id: 'mapbox.streets',
			accessToken: 'pk.eyJ1IjoiYmlsbHRzIiwiYSI6ImNpcmMweDE3eTAwNmVpa25udjgxNWNtc3MifQ.dQaFufbf1N_440j8yKVTPA'
		}).addTo(mymap);
		
		var marker = L.marker([position.coords.latitude, position.coords.longitude]).addTo(mymap);
        
    };

    
    $scope.onGeoError = function(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    };
});
