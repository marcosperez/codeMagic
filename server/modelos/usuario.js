var mongoose = require("./conexion");
var Promise = require('bluebird');

var Usuario = mongoose.model('Usuario', { nombre: String ,password:String});


module.exports = {
    model:Usuario,
    guardar: Usuario.save,
    validar:function(nombre,password){
        return new Promise(function (resolve, reject) {
            Usuario.findOne({'nombre':nombre}).then(function(user){
                if(user.password == password){
                    resolve(user);
                }else{
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

