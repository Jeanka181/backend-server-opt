'use strict'

var hospitalModel = require('../models/hospital');
var controller = {
    // =============================================================
    // Obtener todos los hospitales 
    // =============================================================                    
    getHospitales: function(req, res) {
        var desde = req.query.desde || 0;
        desde = Number(desde);

        hospitalModel.find({})
            .skip(desde)
            .limit(5)
            .populate('usuario', 'nombres correo')
            .exec(
                (err, data) => {
                    if( err ){
                        return res.status(500).json({
                            ok: false,
                            mensaje: 'Error cargando hospitales',
                            errors: err
                        });  
                    }

                    if(!data) {
                        return res.status(404).json({
                            ok: false,
                            mensaje: 'No hay hospitales que mostrar',
                            errors: err
                        });
                    } 

                    hospitalModel.count({}, (err, conteo) =>{
                        
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
                            Hospitales: data                        
                        });
                    });
                    
            });
    },
    // =============================================================
    // Crear hosital 
    // =============================================================                    
    saveHospitales: function(req, res) {
        
        var params = req.body;

        var auxHospital = new hospitalModel({
            nombre: params.nombre,
            img: params.img,
            usuario: params.usuario
        });
        
        auxHospital.save( (err, data) => {
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
                Hospital: data,
                upUser: req.superUsuario
            });            
        });
    },
    // =============================================================
    // ACtualizar hospital 
    // =============================================================                    
    updateHospital: function ( req, res ){
        var hosp_id = req.params.id;
        var data_update = req.body;

        hospitalModel.findByIdAndUpdate(hosp_id, data_update, {new: true}, (err, data) => {
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
                    mensaje: 'No se pudo actualizar:  '+hosp_id+' , no existe',
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
    // Borrar un hospital por id
    // =============================================================
    deleteHospital: function ( req, res ) {
        var hosp_id = req.params.id;

        hospitalModel.findByIdAndRemove(hosp_id, (err, data) => {
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
                    mensaje: 'No se pudo eliminar: '+hosp_id+' , no existe',
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
