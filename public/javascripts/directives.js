var app = angular.module('myApp', []);
app.directive('myTodo', function(){
    return {
      restrict: 'EA',
      templateUrl: 'todo.tpl.html',
      scope: {
        list: '=',
        title: '@'
      }
    };
  });