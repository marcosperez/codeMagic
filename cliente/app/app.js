'use strict';

var socket = false;
// Declare app level module which depends on views, and components
var app = angular.module('myApp', [
    'ngAnimate',
    'ui.bootstrap',
    'RecursionHelper',
    'TreeWidget',
  'ngRoute',
  'myApp.editor',
  'myApp.login',
  'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/login'});
}]);


app.run(function ($rootScope) {

});
