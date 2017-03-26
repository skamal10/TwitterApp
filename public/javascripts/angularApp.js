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
      .when('/verify', {
        templateUrl:'views/verify.ejs',
        controller: 'VerifyCtrl'
      })
      .when('/additem', {
        templateUrl:'views/add_tweet.ejs',
        controller: 'AddItemCtrl'
      })
      .when('/search', {
        templateUrl:'views/search.ejs',
        controller: 'SearchCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });



