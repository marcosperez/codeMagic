var Proyecto = require('../../modelos/proyecto');

module.exports = function (socket) {
    socket.on('abrirProyecto', function (data) {
        console.log("usuario join: " + data.idProyecto);
        socket.idProyecto = data.idProyecto;
        socket.join(data.idProyecto);
    });
    socket.on('recuperar proyectos', function (data) {


    });

    socket.on('alta proyecto', function (data) {
        Proyecto.alta(data.nombre,socket.usuario).then(function(proyecto){
            socket.emit('proyecto',proyecto)
        })
    });
}
