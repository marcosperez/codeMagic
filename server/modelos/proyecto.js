var mongoose = require("./conexion");
var Promise = require('bluebird');
var Schema = mongoose.Schema;
var ProyectoSchema = mongoose.Schema({
    nombre: String
    , usuarios: [{
        type: Schema.Types.ObjectId
        , ref: 'Usuario'
    }]
    , arbol: []
});
var Proyecto = mongoose.model('Proyecto', ProyectoSchema);


module.exports = {
    model: Proyecto
    , alta: function (nombre, usuario) {
        return new Promise(function (resolve, reject) {

            var proyecto = new Proyecto();

            proyecto.nombre = nombre;
            proyecto.usuarios.push(usuario);

            proyecto.arbol = [{
                nombre: nombre
                , children: []
            }];

            proyecto.save().then(function (proyecto) {
                var Usuario = require('./usuario').model;

                Usuario.findById(usuario._id, function (err, usuario) {
                    if (err) reject(err);
                    usuario.proyectos.push(proyecto);
                    usuario.save().then(function () {
                        console.log("proyecto guardado " + nombre)
                        resolve(proyecto);
                    }, function (err) {
                        console.log("fallo 1 " + nombre)
                        reject(proyecto);
                    });
                })
            }, function (err) {
                console.log("fallo 2 " + nombre)
                reject(proyecto);
            });
        });
    }
}
