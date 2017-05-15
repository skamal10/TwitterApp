'use strict';

app.controller('AddItemCtrl', function ($scope, $http,$location) {
  
$scope.tweet_info = null;



$scope.submitPost = function(){

	$http({
          method  : 'POST',
          url     : '/additem',
          data    : { content : $scope.content}
         })
          .success(function(data) {
		          $location.path('get_tweet/'+data.id);
          });
};



  });
