'use strict'

//importo el modelo
var userModel = require('../models/usuario');
var path = require('path');
var bycrypt= require('bcryptjs');

var controller = {

    // =============================================================
    // Obtener todos los usarios 
    // =============================================================                    
    getUsers: function(req, res) {
        //modeloProject.find({year: 2019})
        // lo hago asi, porque no quiero que se muestre el attr: contraseña
        userModel.find({}, 'nombres apellidos correo avatar rol')
            .exec(
                (err, data) => {
                    if( err ){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando usuarios',
                            errors: err
                        });  
                    }

                    if(!data) {
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'No hay proyectos que mostrar',
                            errors: err
                        });
                    } 

                    res.status(200).json({
                        ok: true,
                        Usuarios: data                        
                    });
        });
    },
    // =============================================================
    // Crear usuario nuevo 
    // =============================================================                    
    saveUsers: function(req, res) {
        
        var params = req.body;

        var auxUser = new userModel({
            nombres: params.nombres,
            apellidos: params.apellidos,
            correo: params.correo,
            contrasena: bycrypt.hashSync( params.contrasena, 10),
            avatar: params.avatar,
            rol: params.rol
        });
        
        auxUser.save( (err, data) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al crear el registro',
                    errors: err
                });  
            }

            if(!data) {
                return res.status(404).json({
                    ok: false,
                    mensaje: 'No se ha podido guardar el registro',
                    errors: err
                });
            } 

            data.contrasena = ':)';
            res.status(201).json({
                ok: true,
                Usuarios: data,
                upUser: req.superUsuario
            });            
        });
    },
    // =============================================================
    // ACtualizar usuario nuevo 
    // =============================================================                    
    updateUsers: function ( req, res ){
        var user_id = req.params.id;
        var data_update = req.body;

        userModel.findByIdAndUpdate(user_id, data_update, {new: true}, (err, data) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al actualizar el registro',
                    errors: err
                });  
            }
            if(!data) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo actualizar:  '+user_id+' , no existe',
                    errors: err
                });
            }
            
            data.contrasena = ':)'
            res.status(200).json({
                ok: true,
                Usuario: data
            }); 
            
        });
    },
    // =============================================================
    // Borrar un usuario por id
    // =============================================================
    deleteUsers: function ( req, res ) {
        var user_id = req.params.id;

        userModel.findByIdAndRemove(user_id, (err, data) => {
            if( err ){
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Error al eliminar el registro',
                    errors: err
                });  
            }
            if(!data) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'No se pudo eliminar: '+user_id+' , no existe',
                    errors: { message: err}
                });
            }
            
            data.contrasena = ':)'
            res.status(200).json({
                ok: true,
                Usuario: data
            }); 
        });
    }

}

module.exports = controller;
