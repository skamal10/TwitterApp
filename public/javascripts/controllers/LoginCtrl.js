'use strict';

angular.module('appApp', []).controller('LoginCtrl', function ($scope, $http) {
   
 $scope.credentials= {
 	username: null,
 	password: null
 };


$scope.submitLogin = function(){

	$http({
          method  : 'POST',
          url     : '/login',
          data    : { username : $scope.credentials.username,
          			  password : $scope.credentials.password
          			}
         })
          .success(function(data) {
          		alert(data.status);
          });
};

$scope.viewLoggedInUser = function(){

	$http({
          method  : 'POST',
          url     : '/checkSession',
         })
          .success(function(data) {
          		console.log(data);
          });

}



  });