var mongoose = require("./conexion");
var Promise = require('bluebird');

var UsuarioSchema = mongoose.Schema({ nombre: String ,password:String});

var Usuario = mongoose.model('Usuario',UsuarioSchema );


module.exports = {
    model:Usuario,
    guardar: Usuario.save,
    validar:function(nombre,password){
        return new Promise(function (resolve, reject) {
            Usuario.findOne({'nombre':nombre}).then(function(user){
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

