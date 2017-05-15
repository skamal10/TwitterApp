'use strict';

app.controller('TweetCtrl', function ($scope, $http, $routeParams) {
  
  $scope.tweetId= $routeParams.id;

  $scope.loadTweet = function(){
    $http({
          method  : 'GET',
          url     : '/item/'+$scope.tweetId
         })
          .success(function(data) {
              $scope.tweet = data.item;
          });
  };

  $scope.likeTweet = function(){

  $http({
          method  : 'POST',
          url     : '/item/'+$scope.tweetId+'/like'
        })
          .success(function(data) {
              alert("Tweet Liked!");
          });
};

   $scope.loadTweet();



  });
