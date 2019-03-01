'use strict'

//necesario para exista comunicacion entre las funciones de esta misma clase
var path = require('path');

var hospitalModel = require('../models/hospital');
var medicoModel = require('../models/medico');
var usuarioModel = require('../models/usuario');

var controller = {

    // =============================================================
    // Busqueda por coleccion - tabla 
    // =============================================================
    getBusquedaEspecifica: function( req,res){
        var tabla = req.params.tabla;
        var busqueda = req.params.busqueda;
        var regex = new RegExp( busqueda, 'i');
        var promesa;

        switch ( tabla ){
            case 'hospitales':
                promesa = buscarHospitales(regex); 
                break;
            case 'medicos':
                promesa = buscarMedicos(regex);
                break;
            case 'usuarios':
                promesa = buscarUsuarios(regex);
                break;
            default:
                res.status(404).json({
                    ok: false,
                    mensaje: 'Campos incorrectos, colecciones disponibles: hospitales, medicos, usuarios'
                });
        }
        
        promesa.then( data => {
            return res.status(200).json({
                ok: true,
                [tabla]: data
            });
        });
        
    },
    // =============================================================
    // Busqueda y paginado en hospitales(5), medicos(6) y usuarios(8)
    // =============================================================
    getBusquedaBlobal: function (req, res){
        var busqueda = req.params.busqueda;
        var regex = new RegExp( busqueda, 'i');

        Promise.all([
            buscarHospitales(regex), 
            buscarMedicos(regex),
            buscarUsuarios(regex) 
        ])
        .then( resultados => {
            res.status(200).json({
                ok: true,
                Hospitales: resultados[0],
                Medicos: resultados[1], 
                Usuarios: resultados[2]                     
            });
        })
    }
}

function buscarHospitales (regex){
    return new Promise( (resolve, reject) => {           
        hospitalModel.find({ nombre: regex })
            .limit(5)
            .populate('usuario','nombres apellidos correo')
            .exec(( err, data ) => {
                if(err){
                    reject('Error al cargar hospitales', err);
                }else{
                    resolve(data);
                }
            })
    });
} 

function buscarMedicos (regex){
    return new Promise( (resolve, reject) => {           
        medicoModel.find({ nombre: regex })
            .limit(6)
            .populate('usuario','nombres apellidos correo')
            .populate('hospital')
            .exec((err, data ) => {
                if(err){
                    reject('Error al cargar medicos', err);
                }else{
                    resolve(data);
                }
            });
    });
}

function buscarUsuarios (regex){
    return new Promise( (resolve, reject) => {           
        usuarioModel.find({},'nombres apellidos correo rol')
            .limit(8)
            .or([ { 'nombres': regex }, { 'correo': regex } ])
            .exec( (err, data) =>{
                if(err){
                    reject('Error al cargar usuarios', err);
                }else{
                    resolve(data);
                }
            })
    });
} 


module.exports = controller;
