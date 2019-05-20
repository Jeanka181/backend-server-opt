'use strict'
var path = require('path');
var fs = require('fs');

var controller = {
    
    obtenerImagenes: function( req, res){
        var coleccion = req.params.coleccion;
        var id = req.params.img;
        var auxExtencion = id.split('\.');
        if ( auxExtencion[1] === 'jpeg' ) {
            auxExtencion[1] = '.jpg';
            id=auxExtencion[0]+auxExtencion[1];
        }

        var pathImagen = path.resolve( __dirname, `../uploads/img/${ coleccion }/${ id }` )
 
        if(fs.existsSync( pathImagen )){
            res.sendFile( pathImagen );   
        }else{
            var pathVacia = path.resolve( __dirname, '../assets/no-img.jpg' )
            res.sendFile( pathVacia );  
        }
        /*
        return res.status(200).json({
            ok: true,
            Message: 'Todo belen::: ' + pathImagen 
        }); 
        */        
    }
}

module.exports = controller;
