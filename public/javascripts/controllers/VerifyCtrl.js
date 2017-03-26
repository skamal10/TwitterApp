'use strict';

angular.module('appApp', []).controller('VerifyCtrl', function ($scope, $http,$window) {
   
 $scope.credentials= {
  email: null,
 	verification_key: null
 };



$scope.verify = function(){

	$http({
          method  : 'POST',
          url     : '/verify',
          data    : { email : $scope.credentials.email,
          			      key :    $scope.credentials.verification_key
          			}
         })
          .success(function(data) {
          		$window.location.href = '/login';
          });
  };


  });