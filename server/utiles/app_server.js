var app = require('express')();
var server = require('http').Server(app);
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(bodyParser.json())
app.use(cors());

var Usuario = require('../modelos/usuario');

app.post('/login', function (req, res) {
    console.log(req.body.password)
    Usuario.validar(req.body.nombre, req.body.password).then(function (user) {
        console.log(user);
        res.json({
            user
        });
    }).catch(function (error) {
        console.log(error);
        res.send(error);
        //res.json({error:error});
    });
});



module.exports = {
    server: server
    , app: app
};
