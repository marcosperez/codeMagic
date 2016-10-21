'use strict';
angular.module('myApp.login', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/login', {
        templateUrl: 'vistas/login/login.html'
        , controller: 'LoginCtrl'
    });
}]).controller('LoginCtrl', ['$scope', '$http', '$location','$rootScope','sSocket' ,function ($scope, $http, $location,$rootScope,sSocket) {
    $scope.nombre = "marcos";
    $scope.password = "marcos";
    $rootScope.socket = false;
    $rootScope.usuarios = [];
    $scope.login = function () {

        $http.post('http://172.16.22.114:8001/login', {
            'nombre': $scope.nombre
            , 'password': $scope.password
        }).then(function (response) {
            console.log(response);
            $rootScope.usuario = response.data.user;
            sSocket.obtenerSocket().then(function (socket) {

                 $rootScope.socket=socket;

                 $location.url('/editor');
            }).catch(function (err) {
                console.log(err);
            });
           // socket = io('http://172.16.22.114:8001');

        },function (response) {
            console.log(response);
            /*socket = io('http://172.16.22.114:8001');
            $location.url('/editor');*/
        })
    }
}]);
