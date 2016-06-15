//includes all of the Ionic code which will process the tags

var app = angular.module('MainActivity', ['ionic']);



app.controller('main_activity', function($scope, $ionicModal, $http) {
	
	$ionicModal.fromTemplateUrl('jsonModal.html', function(modal) {
    $scope.jsonModal = modal;
  }, {
    scope: $scope,
    animation: 'slide-in-up'
  });
  
  $scope.details="";
  $scope.result="";
	
	$scope.showJson = function(){
									$scope.jsonModal.show();
									$scope.GETJson();
								 };
	$scope.hideJson = function(){
									$scope.jsonModal.hide();
								 };
	$scope.GETJson = function(){
									$http.get("http://83.212.86.247:3000/user")
									.then(function(response){ $scope.result = response.data; }, function(response){ $scope.result = response.status; });
								 };
});
