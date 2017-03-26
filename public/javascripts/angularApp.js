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
      .when('/adduser', {
        templateUrl:'views/register.ejs',
        controller: 'RegisterCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



