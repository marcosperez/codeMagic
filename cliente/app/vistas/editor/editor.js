'use strict';
angular.module('myApp.editor', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'vistas/editor/editor.html'
        , controller: 'EditorCtrl'
    });
}]).controller('EditorCtrl', ['$scope','$interval','sEditor','$location', function ($scope,$interval,sEditor,$location) {
    //console.log(socket);
    if(!socket)
        $location.url('/login');
    $scope.usuarios = [];

    $scope.codigo = "";

    //var socket = io('http://172.16.22.114:8001');
    $scope.guardar= function() {
        if (sEditor.editor.doc) {
            console.log("guardado");
            socket.emit("guardar",{archivo:editor.doc.getValue()})
        }
    }

    //$interval($scope.guardar, 60000);

    $scope.init = function () {
        sEditor.crearEditor(document.getElementById("code"));
    }
}]);
