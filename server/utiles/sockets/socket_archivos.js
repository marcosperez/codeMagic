module.exports = function (socket) {
    socket.on('guardar', function (data) {
        var nombreArchivo = data.nombreArchivo ? data.nombreArchivo : 'archivo.js';
        fs.writeFile(nombreArchivo, data.archivo, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log('Se guardo correctamente');
        });
    });
    socket.on('recuperar archivo', function (data) {
        var nombreArchivo = data.nombreArchivo ? data.nombreArchivo : 'archivo.js';
        fs.readFile(nombreArchivo, 'utf8', (err, archivo) => {
            if (err) //throw err;
                console.log("El archivo no existe");
            console.log(archivo);
            socket.emit("archivo", {
                archivo: archivo
            });
        });
    });
}
