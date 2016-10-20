'use strict';
angular.module('myApp.editor', ['ngRoute']).config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/editor', {
        templateUrl: 'editor/editor.html'
        , controller: 'EditorCtrl'
    });
}]).controller('EditorCtrl', ['$scope','$interval', function ($scope,$interval) {
    $scope.usuarios = [];
    var editor;
    $scope.codigo = "";
    var socket = io('http://172.16.22.114:8001');
    $scope.guardar= function() {
        if (editor.doc) {
            console.log("guardado");
            socket.emit("guardar",{archivo:editor.doc.getValue()})
        }
    }

    $interval($scope.guardar, 60000);

    $scope.init = function () {
        require.config({
            baseUrl: '/'
        });
        require([
              "node_modules/codemirror/lib/codemirror"
            , "node_modules/codemirror/mode/javascript/javascript"
            , "node_modules/codemirror/addon/hint/javascript-hint"
            , "node_modules/codemirror/addon/hint/show-hint"
            , "node_modules/codemirror/mode/javascript/javascript"
            , "node_modules/codemirror/mode/markdown/markdown"
            , "node_modules/codemirror/addon/hint/xml-hint"
            , "node_modules/codemirror/addon/hint/html-hint"
            , "node_modules/codemirror/mode/htmlmixed/htmlmixed"
            , "node_modules/codemirror/mode/xml/xml"
            , "node_modules/codemirror/mode/css/css"
            ], function (CodeMirror) {


            socket.emit('recuperar',{});
            socket.on('archivo',function(data){
                console.log(data.archivo);
                //$scope.codigo = data.archivo;
                editor.setValue(data.archivo);
                // document.getElementById('c4d981e9a2c98b0483252333_input')
            })
            editor = CodeMirror.fromTextArea(document.getElementById("code"), {
                lineNumbers: true
                , extraKeys: {
                    "Ctrl-Space": "autocomplete"
                }
                , mode: {
                    name: "javascript"
                    , globalVars: true
                }
                , theme: 'material'
                , indentUnit: 4
                , smartIndent: true
                //, electricChars: true
                //, inputStyle: "contenteditable"
            , });
            editor.on("beforeChange", function (code, object) {
                // code.makeChange(editorHTML.doc, object, true);
                //console.log("BeforeChenge");
                //console.log(object);
                socket.emit('accion', {
                    object: object
                    , idOperacion: code.doc.cm.curOp.id
                });
                object.canceled = true;
            });
            socket.on('accion', function (data) {
                editor.realizarAccion(editor.doc, data.object, data.idOperacion);
            });
            //editor.setOption("theme", theme);
            if (typeof Promise !== undefined) {
                var comp = [
        ["here", "hither"]
        , ["asynchronous", "nonsynchronous"]
        , ["completion", "achievement", "conclusion", "culmination", "expirations"]
        , ["hinting", "advive", "broach", "imply"]
        , ["function", "action"]
        , ["provide", "add", "bring", "give"]
        , ["synonyms", "equivalents"]
        , ["words", "token"]
        , ["each", "every"]
      , ]

                function synonyms(cm, option) {
                    return new Promise(function (accept) {
                        setTimeout(function () {
                            var cursor = cm.getCursor()
                                , line = cm.getLine(cursor.line)
                            var start = cursor.ch
                                , end = cursor.ch
                            while (start && /\w/.test(line.charAt(start - 1))) --start
                            while (end < line.length && /\w/.test(line.charAt(end))) ++end
                            var word = line.slice(start, end).toLowerCase()
                            for (var i = 0; i < comp.length; i++)
                                if (comp[i].indexOf(word) != -1) return accept({
                                    list: comp[i]
                                    , from: CodeMirror.Pos(cursor.line, start)
                                    , to: CodeMirror.Pos(cursor.line, end)
                                })
                            return accept(null)
                        }, 100)
                    })
                }
            }
        });
    }
}]);
