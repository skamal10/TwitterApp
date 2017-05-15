'use strict';

app.controller('VerifyCtrl', function ($scope, $http,$routeParams, $location) {
   
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

            if(data.status === 'OK'){

          		$location.path('/login');
            }
            else{
              alert("ERROR");
            }
          });
  };


  });