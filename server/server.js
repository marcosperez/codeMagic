var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser')
var cors = require('cors')
var mongoose = require("./modelos/conexion")
app.use(bodyParser.json())
app.use(cors());


var io = require('socket.io')(server);
const fs = require('fs');
server.listen(8001);


app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

var Usuario = require('./modelos/usuario') ;

app.post('/login',function(req,res){

    console.log(req.body.password)
    Usuario.validar(req.body.nombre,req.body.password).then(function(user){
        res.json({user});
    }).catch(function(error){
        console.log(error);
            res.send(error);
        //res.json({error:error});
    });

});





















/*----------------------Socket---------------------*/

var usuarios = [];
io.on('connection', function (socket) {
    socket.broadcast.emit('usuario conectado');
    socket.on('usuario conectado', function (data) {
        socket.emit('usuarios', data);
        usuarios.push(data);
        socket.broadcast.emit('usuario conectado', data);
    })
    socket.on('accion', function (data) {
        console.log("recibiendo accion: ");
        console.log(data);
        socket.broadcast.emit('accion', data);
        socket.emit('accion', data);
    });
    socket.on('guardar', function (data) {
        var nombreArchivo = data.nombreArchivo ? data.nombreArchivo : 'archivo.js';
        fs.writeFile(nombreArchivo, data.archivo, 'utf8', function (err) {
            if (err) return console.log(err);
            console.log('Se guardo correctamente');
        });
    });
    socket.on('recuperar', function (data) {
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
});
