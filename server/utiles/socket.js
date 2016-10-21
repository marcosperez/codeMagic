var server = require("./app_server").server
var io = require('socket.io')(server);
const fs = require('fs');

var usuarios = [];

io.on('connection', function (socket) {
        //Archivos y proyectos---------------------------------------------------------------
    socket.on('abrirProyecto',function(data){
        console.log("usuario join: "+data.idProyecto);
        socket.idProyecto = data.idProyecto;
        socket.join(data.idProyecto);
    });

    socket.on('guardar', function (data) {
        var nombreArchivo = data.nombreArchivo ? data.nombreArchivo : 'archivo.js';
        fs.writeFile(nombreArchivo, data.archivo, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log('Se guardo correctamente');
        });
    });

    socket.on('recuperar proyectos',function(){

    });

    socket.on('recuperar archivo', function (data) {
        var nombreArchivo = data.nombreArchivo ? data.nombreArchivo : 'archivo.js';
        fs.readFile(nombreArchivo, 'utf8', (err, archivo) => {
            if (err) //throw err;
                console.log("El archivo no existe");
            console.log(archivo);
            socket.to(socket.idProyecto).("archivo", {
                archivo: archivo
            });
        });
    });
    //--------------------------------------------------------------------------

    //Usuarios-----------------------------------------------
    socket.on('usuario conectado', function (data) {
        console.log("Se conecto "+data.nombre);

        socket.emit('usuarios', usuarios);
        console.log(usuarios);
        usuarios.push(data);
        console.log(usuarios);
        socket.usuario = data;
        socket.broadcast.emit('usuario conectado', data);
    });
    socket.on('disconnect', function () {
        console.log("Se desconecto ");
        console.log(socket.usuario._id);
        usuarios.splice(usuarios.indexOf(socket.usuario),1);
        socket.broadcast.emit('usuario desconectado',socket.usuario);
      });
    //----------------------------------------------------------


    //Editor-----------------------------------------------------------
    socket.on('accion', function (data) {
        console.log("recibiendo accion: ");
        console.log(data);
        socket.broadcast.emit('accion', data);
        socket.emit('accion', data);
    });
    //-------------------------------------------------------------------
});
