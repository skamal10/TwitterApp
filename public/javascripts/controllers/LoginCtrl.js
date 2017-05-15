'use strict';

app.controller('LoginCtrl', function ($scope, $http, $routeParams,$location) {
   
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
          		alert(data.message);

              if(data.status === 'OK'){
                $location.path('/');
              }

          });
};

$scope.viewLoggedInUser = function(){

	$http({
          method  : 'POST',
          url     : '/checkSession',
         })
          .success(function(data) {
          		console.log(new Date());
          });

}



  });