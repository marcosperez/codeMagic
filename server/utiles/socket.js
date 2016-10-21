var server = require("./app_server").server
var io = require('socket.io')(server);
const fs = require('fs');

io.on('connection', function (socket) {

    //Divicion de los comportamientos del socket en archivos
    require("./sockets/socket_usuarios.js")(socket);
    require("./sockets/socket_proyectos.js")(socket);
    require("./sockets/socket_archivos.js")(socket);


    //Editor-----------------------------------------------------------
    socket.on('accion', function (data) {
        console.log("recibiendo accion: ");
        console.log(data);
        socket.broadcast.to(socket.idProyecto).emit('accion', data);
        socket.emit('accion', data);
    });
    //-------------------------------------------------------------------
});
