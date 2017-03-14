'use strict';


angular.
module('myApp', []).
  config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl:'views/index.ejs',
        controller: 'HomeCtrl'
      })
      .when('/login', {
        templateUrl:'views/login.ejs',
        controller: 'LoginCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



