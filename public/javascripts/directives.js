var app = angular.module('appApp', []);
app.directive('myTodo', function(){
    return {
      restrict: 'E',
      templateUrl: 'tweet.ejs',
      scope: {
        content: '=',
        username: '='
      }
    };
  });


app.controller('tweet', function($scope){
  $scope.content = "I FUCKED MY DAD";
  $scope.username = "skamal10";
});