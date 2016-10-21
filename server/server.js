var mongoose = require("./modelos/conexion")
var server = require("./utiles/app_server").server
var socket = require("./utiles/socket");


server.listen(8001,function(){
    console.log("Servidor y socket corriendo en http://172.16.22.114:8001");
});
