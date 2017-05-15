'use strict';

var app = angular.module('twitterApp', ['ngRoute']);
app.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl:'addtweet',
        controller: 'AddItemCtrl'
      })
      .when('/login', {
        templateUrl:'login',
        controller: 'LoginCtrl'
      })
      .when('/get_tweet/:id', {
        templateUrl:'tweet',
        controller: 'TweetCtrl'
      })
      .when('/register', {
        templateUrl:'adduser',
        controller: 'RegisterCtrl'
      })
      .when('/verify', {
        templateUrl:'verify',
        controller: 'VerifyCtrl'
      })
      .when('/addtweet', {
        templateUrl:'addtweet',
        controller: 'AddItemCtrl'
      })
      .when('/search', {
        templateUrl:'search',
        controller: 'SearchCtrl'
      })
      .when('/user/:username',{
        templateUrl:'followers',
        controller: 'FollowersCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });

app.run( function($rootScope, $location, $http) {

    // register listener to watch route changes
    $rootScope.$on( "$routeChangeStart", function(event, next, current) {

      $http({
          method  : 'GET',
          url     : '/loggedInUser',
         })
          .success(function(data) {

            var restrictedPage = $.inArray($location.path(), ['/login', '/register', '/verify']) === -1;
            var loggedIn = data === '0';
            if (restrictedPage && loggedIn) {
                $location.path('/login');
            }
              


          });
    });
 });


