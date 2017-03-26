'use strict';

angular.module('appApp', []).controller('RegisterCtrl', function ($scope, $http) {
   
 $scope.credentials= {
 	username: null,
 	password: null,
 	email: null,
 };
  });

$scope.submitRegistration = function(){

	$http({
          method  : 'POST',
          url     : '/adduser',
          data    : { 	
				username : $scope.credentials.username,
          			password : $scope.credentials.password,
				email: $scope.credentials.email
          		  }
         })
          .success(function(data) {
          		alert(data.status);
          });
};
