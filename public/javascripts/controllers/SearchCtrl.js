
'use strict';

angular.module('appApp', []).controller('SearchCtrl', function ($scope, $http) {
  
 $scope.tweets = null;   
 $scope.credentials = {
 	timestamp: null,
 	limit: null
 };
  
$scope.submitSearch = function(){

	$http({
          method  : 'POST',
          url     : '/search',
          data    : { 	
				timestamp : $scope.credentials.timestamp,
				limit : $scope.credentials.limit
          		  }
         })
          .success(function(data) {
			  $scope.tweets = data.items; 
			  alert(data.status);
          });
};
});

