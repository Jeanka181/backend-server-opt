'use strict'

var mongoose = require('mongoose');
var app = require('./app.routes');
var port = 3700;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/hospitalDB')
    .then(()=>{
       console.log('==> Conexión a DB: \x1b[32m%s\x1b[0m', 'hospitalDB, exitosa ...'); 
       
       // cracion del servidor
       app.listen(port, ()=>{
            console.log('==> Servidor listo: \x1b[32m%s\x1b[0m', 'online in 3700 ...');
       });

    })
    .catch(err => console.log("Error: " + err));
