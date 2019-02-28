var app = require('express');
var userModel = require('../models/usuario');
var bycrypt= require('bcryptjs');
var jwt = require('jsonwebtoken');
var semilla = require('../config/config');


var app = {
    loginApp: function( req, res ) {

        var param = req.body;

        userModel.findOne({ correo: param.correo }, (err, data) => {

            if( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuarios',
                    errors: err
                });  
            }
            if(!data) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas (+)',
                    errors: err
                });
            }

            if(bycrypt.compareSync( param.contrasena, data.contrasena) == false ){
                
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas (-)',
                    errors: 'invalid'
                });
            }

            data.contrasena = ':)';

            /* res.status(200).json({
                ok: true,
                message: 'todo belen'
            }); */

            //Crear un token, JWT..!!
            var token = jwt.sign({ usuario: data }, semilla.seed, { expiresIn: 14400 }); // 4horas
            res.status(200).json({
                ok: true,
                User: data,
                Token: token
            });
        });
    }
}

module.exports = app;
