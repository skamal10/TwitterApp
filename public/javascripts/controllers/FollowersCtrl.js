'use strict';

app.controller('FollowersCtrl', function ($scope,$http, $routeParams) {
   
$scope.followers = [];
$scope.currentUser= $routeParams.username;



    $http({
          method  : 'GET',
          url     : '/user/'+$scope.currentUser+'/followers',
         })
          .success(function(data) {
			 $scope.followers = data;
          });

      $http({
          method  : 'GET',
          url     : '/user/'+$scope.currentUser+'/following',
         })
          .success(function(data) {
              $scope.following = data;
          });


    $scope.followUser = function(){
      $http({
          method  : 'POST',
          url     : '/follow',
          data    : {follow: true, username: $scope.currentUser}
         })
          .success(function(data) {
            if(data.status === 'error'){
              alert(data.error);
            }
            else{
              alert("Followed User");
            }
          });
    }

       $scope.unFollowUser = function(){
      $http({
          method  : 'POST',
          url     : '/follow',
          data    : {follow: false, username: $scope.currentUser}
         })
          .success(function(data) {
            if(data.status === 'error'){
              alert(data.error);
            }
            else{
              alert("Followed User");
            }
          });
    }
  });



