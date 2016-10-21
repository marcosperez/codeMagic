var mongoose = require("./conexion");
var Promise = require('bluebird');
var Schema = mongoose.Schema;


var UsuarioSchema = mongoose.Schema({
    nombre: String ,
    password:String,
    proyectos:[{ type: Schema.Types.ObjectId, ref: 'Proyecto' }]
});

var Usuario = mongoose.model('Usuario',UsuarioSchema );
var Proyecto = require('./proyecto').model;

module.exports = {
    model:Usuario,
    guardar: Usuario.save,
    validar:function(nombre,password){
        return new Promise(function (resolve, reject) {
            Usuario.findOne({'nombre':nombre})
                .populate('proyectos')
                .then(function(user){
                if(user){// && user.password == password){
                    //Usuario existente y valido
                    resolve(user);
                }else{
                    //Alta de usuario o usuario invalido
                    var user = new Usuario({'nombre':nombre,'password':password});
                    //Si no existe crea uno nuevo.
                    user.save().then(function(user){
                        resolve(user);
                    }).catch(function(err){
                        reject(err);
                    });
                }

            }).catch(function(err){
                reject(err);
            });
        })
    }
}

