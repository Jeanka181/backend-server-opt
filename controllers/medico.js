'use strict'

var medicoModel = require('../models/medico');
var controller = {
    // =============================================================
    // Obtener todos los usarios 
    // =============================================================                    
    getMedico: function(req, res) {
        var desde = req.query.desde || 0;
        desde = Number(desde);

        medicoModel.find({})
            .skip(desde)
            .limit(3)
            .populate('usuario', 'nombres correo')
            .populate('hospital')
            .exec(
                (err, data) => {
                    if( err ){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando medicos',
                            errors: err
                        });  
                    }

                    if(!data) {
                        return res.status(404).json({
                            ok: false,
                            mensaje: 'No hay medicos que mostrar',
                            errors: err
                        });
                    } 

                    medicoModel.count({}, (err, conteo) =>{
                        
                        if( err ){
                            return res.status(500).json({
                                ok: false,
                                mensaje: 'Error al contar registros',
                                errors: err
                            });  
                        }
                        res.status(200).json({
                            ok: true,
                            Total: conteo,
                            Medico: data                        
                        });
                    });
                    
            });
    },
    // =============================================================
    // Crear hosital 
    // =============================================================                    
    saveMedico: function(req, res) {
        
        var params = req.body;

        var auxMedico = new medicoModel({
            nombre: params.nombre,
            img: params.img,
            usuario: params.usuario,
            hospital: params.hospital
        });
        
        auxMedico.save( (err, data) => {
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

            res.status(201).json({
                ok: true,
                Medico: data,
                upUser: req.superUsuario
            });            
        });
    },
    // =============================================================
    // ACtualizar medico 
    // =============================================================                    
    updateMedico: function ( req, res ){
        var medico_id = req.params.id;
        var data_update = req.body;

        medicoModel.findByIdAndUpdate(medico_id, data_update, {new: true}, (err, data) => {
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
                    mensaje: 'No se pudo actualizar:  '+medico_id+' , no existe',
                    errors: err
                });
            }
            
            data.contrasena = ':)'
            res.status(200).json({
                ok: true,
                Hospital: data
            }); 
            
        });
    },
    // =============================================================
    // Borrar un medico por id
    // =============================================================
    deleteMedico: function ( req, res ) {
        var medico_id = req.params.id;

        medicoModel.findByIdAndRemove(medico_id, (err, data) => {
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
                    mensaje: 'No se pudo eliminar: '+medico_id+' , no existe',
                    errors: { message: err}
                });
            }
            
            data.contrasena = ':)'
            res.status(200).json({
                ok: true,
                Hospital: data
            }); 
        });
    }
}

module.exports = controller;
