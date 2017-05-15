
'use strict';

app.controller('SearchCtrl', function ($scope, $http, $location) {
  
 $scope.tweets = null;   
 $scope.credentials = {
 	timestamp: null,
 	limit: null,
  q: null,
  username: null,
  following: false
 };
  
$scope.submitSearch = function(){

	$http({
          method  : 'POST',
          url     : '/search',
          data    : { 	
				timestamp : $scope.credentials.timestamp,
				limit : $scope.credentials.limit,
        q: $scope.credentials.q,
        username: $scope.credentials.username,
        following: $scope.credentials.following
          		  }
         })
          .success(function(data) {

        if(data.status === 'error'){
          alert(data.error);
        }
        else{
          $scope.tweets = data.items; 
        }
			   
          });
};

$scope.likeTweet = function(tweet){

  $http({
          method  : 'POST',
          url     : '/item/'+tweet.id+'/like'
        })
          .success(function(data) {
              alert("Tweet Liked!");
          });
};

});

