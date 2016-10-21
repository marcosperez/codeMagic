'use strict';
angular.module('myApp.editor', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'vistas/editor/editor.html'
        , controller: 'EditorCtrl'
    });
}]).controller('EditorCtrl', ['$scope', '$interval', 'sEditor', '$location', '$rootScope', function ($scope, $interval, sEditor, $location, $rootScope) {
    //console.log(socket);
    var socket = $rootScope.socket;
    $scope.usuarios = $rootScope.usuarios;
    $scope.proyectos = [];
    //$interval($scope.guardar, 60000);
    $scope.treeNodes = {};
    $scope.init = function () {
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
        sEditor.crearEditor(document.getElementById("code")).then(function (sEditor) {
                $scope.proyectos = $rootScope.usuario.proyectos;
                $scope.nuevoProyecto = function () {
                    var nombre = window.prompt("Nombre del proyecto:", "prueba");
                    sEditor.crearProyecto(nombre)
                        .then(function (proyecto) {
                        $scope.proyectos.push(proyecto);

                        $scope.treeNodes = pro.arbol;
                    });
                }
                $scope.$on('usuarios', function (event, arg) {
                    console.log("usuarios:");
                    console.log(arg);
                    $scope.usuarios = $rootScope.usuarios;
                    $scope.$apply();
                });
                $scope.abrirProyecto = function (proyecto) {
                    debugger
                    $scope.treeNodes = proyecto.arbol;
                }
            }).catch(function () {
                $location.url('/login');
            })
            //$scope.$apply();
    }
}]);
