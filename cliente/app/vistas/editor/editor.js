'use strict';
angular.module('myApp.editor', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'vistas/editor/editor.html'
        , controller: 'EditorCtrl'
    });
}]).controller('EditorCtrl', ['$scope', '$interval', 'sEditor', '$location','$rootScope', function ($scope, $interval, sEditor, $location,$rootScope) {
    //console.log(socket);
    var socket = $rootScope.socket;
    $scope.usuarios = $rootScope.usuarios;
    if (!socket) {
        $location.url('/login');
    }
    else {

        $scope.codigo = "";
        //var socket = io('http://172.16.22.114:8001');
        $scope.guardar = function () {
                if (sEditor.editor.doc) {
                    console.log("guardado");
                    socket.emit("guardar", {
                        archivo: editor.doc.getValue()
                    })
                }
            }
            //$interval($scope.guardar, 60000);
        $scope.init = function () {
            sEditor.crearEditor(document.getElementById("code"));

        }

        $scope.nuevoProyecto = function(){

        }

        $scope.$on('usuarios', function (event, arg) {

            console.log("usuarios:");
            console.log(arg);
            $scope.usuarios = $rootScope.usuarios;
            $scope.$apply();
        });
    }
}]);
