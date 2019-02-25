// requires, librerias de terceros
var express = require('express');
var mongoose = require('mongoose');

// INicializar variables
var app = express();

// Coexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (err,res) =>{
    if(err) throw err
    console.log('==> Conexión a DB: \x1b[32m%s\x1b[0m', 'hospitalDB, exitosa ...');
});


// RUTAS
// Codigos http::: https://es.wikipedia.org/wiki/Anexo:C%C3%B3digos_de_estado_HTTP
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición exitosa'
    });
});


//Escuchar peticiones
app.listen(3700, () => {
    console.log('==> Express server listo: \x1b[32m%s\x1b[0m', 'online in 3700 ...');
})