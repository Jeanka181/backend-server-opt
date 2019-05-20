//necesario para exista comunicacion entre las funciones de esta misma clase
var path = require('path');
var fs = require('fs');

var hospitalModel = require('../models/hospital');
var medicoModel = require('../models/medico');
var usuarioModel = require('../models/usuario');

var controller = {
    // =============================================================
    // Funcion global que, Actualiza imagen, borra del temporal la pasa a la carpeta fija
    // y luego borra la imagen antigua de las colecciones valdias 
    // =============================================================
    setLoadImage: function(req, res){
        var coleccionesValidas = ['hospitales', 'medicos', 'usuarios'];
        var extencionesValidas = ['png', 'jpg', 'jpeg', 'gif']; 
        
        var coleccion = req.params.coleccion;
        var entidad_id= req.params.id;
        var fileName = 'Imagen no cargada...';

        if(req.files){
            var filePath = req.files.imagen.path;
            var file_split = filePath.split('\\');
            fileName = file_split[2];
            var ext_split = fileName.split('\.');
            var fileExtencion = ext_split[ext_split.length - 1];                       
            
            if( coleccionesValidas.indexOf( coleccion ) < 0 ){
                return res.status(400).json({
                    ok: false,
                    Message: 'Colección no validad',
                    errors: { message: 'Las colecciones permitidas son: ' + extencionesValidas.join(', ') }
                }); 
            }
            
            if( extencionesValidas.indexOf(fileExtencion) < 0 ){
                fs.unlink(filePath, (err) => {
                    if(err){
                        return res.status(500).json({
                            ok: false,
                            Message: 'Error al elimnar el archivo incorrecto en temp',
                            errors: err
                        }); 
                    }
                });
                return res.status(400).json({
                    ok: false,
                    Message: 'Extención no validad',
                    errors: { message: 'Las extenciones permitidas son: ' + extencionesValidas.join(', ') }
                });
            }

            var nombreArchivo = `${ entidad_id}-${ new Date().getMilliseconds() }.${ fileExtencion }`;
            subirPorColeccion(coleccion, entidad_id, nombreArchivo, filePath, res);

        }else{
            return res.status(404).json({
                ok: true,
                Message: 'No selecciono nada',
                errors: { message: 'Seleccione una imagen' }
            });
        }        
    }
}

function subirPorColeccion(coleccion, id, nameFile, filePath, res) {
    // carpeta fija, dnd deben guardarse al final en el server
    var path_final = './uploads/img';
    switch ( coleccion ){
        case 'usuarios':
            path_final = path_final+'/usuarios/'+nameFile;
            updateUsuarios(id,nameFile, filePath, path_final, res);
            break;
        case 'medicos':
            path_final = path_final+'/medicos/'+nameFile;
            updateMedicos(id,nameFile, filePath, path_final, res);
            break;
        case 'hospitales':
            path_final = path_final+'/hospitales/'+nameFile;
            updateHospitales(id,nameFile, filePath, path_final, res);
            break;
    }
}

// =============================================================
// Funcion para coleccion de Usuarios
// =============================================================
function updateUsuarios(id, nameFile, filePath, path_final, res) {

    usuarioModel.findById(id, ( err, data) => {
        if(err){
            return res.status(400).json({
                ok: false,
                Message: 'Error, no se encontro al Usuario: '+id,
                errors: err
            }); 
        }
        // guardo aux con imagen antigua, antes quese pierda
        var pathImagenAntigua;
        if(data.img!=""){
            pathImagenAntigua = 'uploads\\img\\usuarios\\'+ data.avatar;
        }else{
            pathImagenAntigua = 'uploads\\img\\usuarios\\none.png';
        }
        // se guarda la nueva imagen
        data.avatar = nameFile;
        data.save((err, data_actualizada) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    Message: 'Error al actualizar la colección',
                    errors: err
                }); 
            }
            data_actualizada.contrasena = ':)';
            guardarArchivoEnCarpeta(filePath, path_final, pathImagenAntigua, res, data_actualizada);
        });
    });
}

// =============================================================
// Funcion para coleccion de medicos
// =============================================================
function updateMedicos(id, nameFile, filePath, path_final, res) {

    medicoModel.findById(id, ( err, data) => {
        if(err){
            return res.status(400).json({
                ok: false,
                Message: 'Error, no se encontro al Medico: '+id,
                errors: err
            }); 
        }
        // guardo aux con imagen antigua, antes quese pierda
        var pathImagenAntigua;
        if(data.img!=""){
            pathImagenAntigua = 'uploads\\img\\medicos\\'+ data.img;
        }else{
            pathImagenAntigua = 'uploads\\img\\medicos\\none.png';
        }

        // se guarda la nueva imagen
        data.img = nameFile;
        data.save((err, data_actualizada) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    Message: 'Error al actualizar la colección',
                    errors: err
                }); 
            }
            guardarArchivoEnCarpeta(filePath, path_final, pathImagenAntigua, res, data_actualizada);
        });
    });
}

// =============================================================
// Funcion para coleccion de hospitales
// =============================================================
function updateHospitales(id, nameFile, filePath, path_final, res) {

    hospitalModel.findById(id, ( err, data) => {
        if(err){
            return res.status(400).json({
                ok: false,
                Message: 'Error, no se encontro al Hospital: '+id,
                errors: err
            }); 
        }
        // guardo aux con imagen antigua, antes quese pierda
        var pathImagenAntigua;
        if(data.img!=""){
            pathImagenAntigua = 'uploads\\img\\hospitales\\'+ data.img;
        }else{
            pathImagenAntigua = 'uploads\\img\\hospitales\\none.png';
        }

        // se guarda la nueva imagen
        data.img = nameFile;
        data.save((err, data_actualizada) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    Message: 'Error al actualizar la colección',
                    errors: err
                }); 
            }
            guardarArchivoEnCarpeta(filePath, path_final, pathImagenAntigua, res, data_actualizada);
        });
    });
}


// =============================================================
// FUNCIONES NECESARIAS PARA SUBIR ARCHIVOS POR COLECCION
// =============================================================

function guardarArchivoEnCarpeta(path_temp, path_final, pathArchivoAntiguo, res, data_actualizada ){
    
    // borro archivo antigua del usuario en la carpeta final
    if( fs.existsSync(pathArchivoAntiguo) ){
        fs.unlink(pathArchivoAntiguo, (err) => {
            if(err){
                return res.status(500).json({
                    ok: false,
                    Message: 'Error al elimnar el archivo antiguo',
                    errors: err
                }); 
            }
        });
    }

    // Se pasa la imagen de la carpeta temporal a la final
    // file paht: es la temporal 
    fs.rename(path_temp, path_final, ( err ) => {
        if(err){
            return res.status(500).json({
                ok: false,
                Message: 'Error al mover el archivo',
                errors: err
            }); 
        }
        // borro archivo de la carpeta temporal
        fs.unlink(path_temp, function() {
            if(err){
                return res.status(500).json({
                    ok: false,
                    Message: 'Error al elimnar el archivo temporal',
                    errors: err
                }); 
            }
            return res.status(200).json({
                ok: true,
                Message: 'Actualizado exitosamente',
                Result: data_actualizada,
                //FilePathTemp: path_temp,
                //FilePathFinal: pathArchivoAntiguo
            });
        });
    });
    
}

module.exports = controller;
