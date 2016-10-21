var usuarios = [];

module.exports = function (socket) {

    //Usuarios-----------------------------------------------
    socket.on('usuario',function(data){
        console.log("Se conecto " + data.nombre);
        socket.usuario = data;
    });

    socket.on('usuario conectado', function (data) {

        socket.emit('usuarios', usuarios);
        //console.log(usuarios);
        usuarios.push(data);
        //console.log(usuarios);

        socket.broadcast.to(socket.idProyecto).emit('usuario conectado', data);
    });
    socket.on('disconnect', function () {
        console.log("Se desconecto ");
        if (socket.usuario) {
            console.log(socket.usuario._id);
            usuarios.splice(usuarios.indexOf(socket.usuario), 1);
            socket.broadcast.to(socket.idProyecto).emit('usuario desconectado', socket.usuario);
        }
    });
    //----------------------------------------------------------
}
