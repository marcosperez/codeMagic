app.service('sEditor', ['$log', 'sSocket', '$rootScope', '$q', function ($log, sSocket, $rootScope, $q) {
    var sEditor = this;
    var archivos = [];
    var proyectos = [];
    var socket = $rootScope.socket;
    sEditor.editor = false;
    require.config({
        baseUrl: '/'
    });
    sEditor.crearEditor = function (domElementCode) {
        var deferred = $q.defer();
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
                //document.getElementById("code")
                sEditor.editor = CodeMirror.fromTextArea(domElementCode, {
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

                deferred.resolve(sEditor);
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
                sSocket.obtenerSocket().then(function (socket) {
                    //socket.emit('recuperar proyectos',{});
                    //sSocket.cargarProyecto('testRoom');
                    sEditor.editor.on("beforeChange", function (code, object) {
                        socket.emit('accion', {
                            object: object
                            , idOperacion: code.doc.cm.curOp.id
                        });
                        object.canceled = true;
                    });
                    socket.on('accion', function (data) {
                        sEditor.editor.realizarAccion(sEditor.editor.doc, data.object, data.idOperacion);
                    });
                    sEditor.cargarArchivo = function (idArchivo) {
                        Proyecto.cargarArchivo(idArchivo);
                    }
                    sEditor.crearProyecto = function (nombre) {
                        var deferred = $q.defer();
                        socket.emit('alta proyecto', {
                            nombre: nombre
                        });
                        socket.on('proyecto', function (pro) {
                            debugger
                            proyectos.push(new Proyecto(pro));

                            deferred.resolve(pro);
                        })
                        return deferred.promise;
                    }
                }).catch(function (err) {
                    console.log(err);
                });
                //sEditor.cargarArchivo();
            });

        return deferred.promise;
        }
        /*-----------Archivo------------------------------------------*/
    var Archivo = function (idArchivo) {
            this.buffer = null;
            this.path = path;
            this.nombre = nombre;
            socket.emit('recuperar archivo', {
                path: path
                , nombre: nombre
            });
            socket.on('archivo', function (data) {
                console.log(data.archivo);
                this.buffer = CodeMirror.Doc(data.archivo, 'javascript');
                archivos[idArchivo] = this;
                console.log("Eureca!!");
                sEditor.editor.swapDoc(this.buffer);
            })
        }
        /*-------------------------------------------------------------*/
        /*------------------------Proyecto-----------------------------*/
    var Proyecto = function (pro) {
            this.archivos_buffers = {};
            this.archivoActivo = null;
            this.nombre = pro.nombre;
            this._id = pro._id;
            this.cargarArchivo = function (idArchivo) {
                var archivo = this.archivos_buffers[idArchivo];
                if (archivo) {
                    sEditor.editor.swapDoc(archivo.buffer);
                }
                else {
                    archivo = new Archivo(idArchivo);
                    this.archivos_buffers[idArchivo] = archivo;
                }
                this.archivoActivo = archivo;
            };
        }
        /*-------------------------------------------------------------*/
}])
