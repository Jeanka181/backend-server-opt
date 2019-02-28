'use strict'

var express = require('express');
var bodyparse = require('body-parser');

var app = express();

// cargar archivos de rutas -> luego ir a montar la ruta (4.)
var loginController = require('./controllers/login');
var userRoutes = require('./routes/usuario')




// middlewares
app.use(bodyparse.urlencoded({extended:false}));
app.use(bodyparse.json());


// =============================================================
// CORS
//      https://victorroblesweb.es/2018/01/31/configurar-acceso-cors-en-nodejs/
// =============================================================
// Configurar cabeceras y cors
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


// =============================================================
// Rutas del sever
// =============================================================                    

// default
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición exitosa al Backend << Hospitales >>' 
    });
});

// login
app.post('/login', loginController.loginApp);

// Usuarios
app.use('/api', userRoutes);

// export
module.exports = app;
