
'use strict';

angular.module('appApp', []).controller('AddItemCtrl', function ($scope, $http) {
  
$scope.tweet_info = null;
 $scope.credentials= {
 	content: null
 };



$scope.submitPost = function(){

	$http({
          method  : 'POST',
          url     : '/additem',
          data    : { content : $scope.credentials.content
          		  }
         })
          .success(function(data) {
		    $scope.tweet_info = "Tweet ID: " + data.id;	
		    alert(data.status);
          });
};



  });
