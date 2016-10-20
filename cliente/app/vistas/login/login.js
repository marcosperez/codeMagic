'use strict';
angular.module('myApp.login', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'vistas/login/login.html'
        , controller: 'LoginCtrl'
    });
}]).controller('LoginCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
    $scope.nombre = "marcos";
    $scope.password = "marcos";
    $scope.login = function () {
        $http.post('http://172.16.22.114:8001/login', {
            'nombre': $scope.nombre
            , 'password': $scope.password
        }).then(function (response) {
            console.log(response);
            socket = io('http://172.16.22.114:8001');
            $location.url('/editor');
        },function (response) {
            console.log(response);
            /*socket = io('http://172.16.22.114:8001');
            $location.url('/editor');*/
        })
    }
}]);
