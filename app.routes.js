'use strict'

var express = require('express');
var bodyparse = require('body-parser');



var app = express();
// =============================================================
// CORS
// https://enable-cors.org/server_expressjs.html      
// =============================================================
// Configurar cabeceras y cors

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});

// =============================================================
// Cargar archivos de rutas -> luego ir a montar la ruta (4.)
// =============================================================

var loginRoutes = require('./routes/login.routes');
var userRoutes = require('./routes/usuario.routes');
var hospitalRoutes = require('./routes/hospital.routes');
var medicoRouter = require('./routes/medico.routes');
var busquedaRoutes = require('./routes/busqueda.routes');
var uploadRoutes = require('./routes/upload.routes');
var getImagenes = require('./routes/getImagen.routes');


// middlewares
app.use(bodyparse.urlencoded({extended:false}));
app.use(bodyparse.json());


// =============================================================
// Rutas del sever (4.)
// =============================================================                    

// default
app.get('/', (req, res, next) => {
    res.status(200).json({
        ok: true,
        mensaje: 'Petición exitosa al Backend << Hospitales >>' 
    });
});

// aplicacion-secciones-paginas
app.use('/api', loginRoutes);
app.use('/api', userRoutes);
app.use('/api', hospitalRoutes);
app.use('/api', medicoRouter);
app.use('/api', busquedaRoutes);
app.use('/api', uploadRoutes);
app.use('/api', getImagenes);

// export
module.exports = app;
