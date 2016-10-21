app.service('sSocket', ['$log', '$rootScope', '$q', function ($log, $rootScope, $q) {
    var sSocket = this;
    sSocket.socket = false;
    sSocket.obtenerSocket = function () {
        var deferred = $q.defer();
        if (sSocket.socket) {
            deferred.resolve(sSocket.socket);
        }
        else {
            sSocket.socket = io('http://172.16.22.114:8001');
            //Conectados
            sSocket.socket.on('connect', function (socket) {
                deferred.resolve(sSocket.socket);
                sSocket.cargarProyecto = function (abrirProyecto) {
                    sSocket.socket.emit('setProyecto', {
                        idProyecto: idProyecto
                    });
                    //informo de mi presencia
                    console.log($rootScope.usuario);
                    sSocket.socket.emit('usuario conectado', $rootScope.usuario);
                    //Recibo el resto de los usuarios
                    sSocket.socket.on('usuarios', function (data) {
                        $rootScope.usuarios = data;
                        $rootScope.$broadcast('usuarios', data);
                    });
                    //Agrego un usuario nuevo
                    sSocket.socket.on('usuario conectado', function (data) {
                        $rootScope.usuarios.push(data);
                        $rootScope.$broadcast('usuarios', data);
                    });
                    //Quito el usuario desconectado
                    sSocket.socket.on('usuario desconectado', function (data) {
                        $rootScope.usuarios.splice($rootScope.usuarios.indexOf(data), 1);
                        $rootScope.$broadcast('usuarios', data);
                    });
                }
            });
            //Error
            sSocket.socket.on('error', function (err) {
                deferred.reject(err);
            });
        }
        return deferred.promise;
    }
}])
