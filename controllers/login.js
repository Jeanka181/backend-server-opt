var app = require('express');
var path = require('path');

var userModel = require('../models/usuario');
var const_config = require('../config/config');

var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

// google
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(const_config.googleClientID);


var app = {

    // =============================================================
    // Autenticacion por API-GOOGLE SIGN-IN
    // =============================================================
    loginAppGoogle: async function(req, res) {

        var token = req.body.token;

        if(token){
            var google_user = await verify(token)
                .catch( err => {
                    return res.status(403).json({
                        ok: false,
                        message: 'Token G no válido...'
                    });
                })

            userModel.findOne( { correo: google_user.email }, ( err, usuarioDB ) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar usuarios',
                        errors: err
                    });
                }
                if ( usuarioDB ) {
                    if( usuarioDB.google === false ){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Debe usar su autenticación normal',
                            errors: err
                        });
                    }else{
                        //Crear un token, JWT..!!
                        var token = jwt.sign({ usuario: usuarioDB }, const_config.seed, { expiresIn: 14400 }); // 4horas
                        res.status(200).json({
                            ok: true,
                            User: usuarioDB,
                            Token: token
                        });
                    }
                }else{
                    // el usuario no existe hay que crearlo
                    var usuario_nuevo = new userModel();
                    
                    usuario_nuevo.nombres =  google_user.nombre;
                    usuario_nuevo.apellidos = 'G-API: '+ google_user.nombre;
                    usuario_nuevo.correo = google_user.email;
                    usuario_nuevo.contrasena = ':)';
                    usuario_nuevo.avatar = google_user.img;
                    usuario_nuevo.google = true;

                    usuario_nuevo.save((err, usuarioDB) => {
                        if (err) {
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al crear el usuario G ',
                                errors: err
                            });
                        }
                        //Crear un token, JWT..!!
                        var token = jwt.sign({ usuario: usuarioDB }, const_config.seed, { expiresIn: 14400 }); // 4horas
                        res.status(200).json({
                            ok: true,
                            User: usuarioDB,
                            Token: token
                        });

                    });
                }
            });            
        }else{
            return res.status(403).json({
                ok: false,
                message: 'Token G no válido(null) ...'
            });
        }
        
    },
    // =============================================================
    // Autenticacion normal hecha por la app
    // =============================================================
    loginApp: function (req, res) {

        var param = req.body;

        userModel.findOne( { correo: param.correo }, (err, data) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al buscar usuarios',
                    errors: err
                });
            }
            if (!data) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas (+)',
                    errors: err
                });
            }

            if (bycrypt.compareSync(param.contrasena, data.contrasena) == false) {

                return res.status(400).json({
                    ok: false,
                    mensaje: 'Credenciales incorrectas (-)',
                    errors: 'invalid'
                });
            }

            data.contrasena = ':)';
            
            //Crear un token, JWT..!!
            var token = jwt.sign({ usuario: data }, const_config.seed, { expiresIn: 14400 }); // 4horas
            res.status(200).json({
                ok: true,
                User: data,
                Token: token
            });
        });
    }
}

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: const_config.googleClientID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    // const domain = payload['hd'];

    var result = {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
    return result;
}


module.exports = app;