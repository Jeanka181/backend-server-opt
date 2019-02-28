var jwt = require('jsonwebtoken');
var semilla = require('../config/config');

// =============================================================
// Verificar Token
// =============================================================

exports.validateToken = function( req, res, next ){
    var token = req.query.token;

    jwt.verify(token, semilla.seed, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                ok: false,
                mensaje: 'Acceso denegado, Sin permisos (*)',
                errors: 'invalid'
            });
        }
        req.superUsuario = decoded.usuario;

        next();
        /* return res.status(200).json({
            ok: tur,
            mensaje: decoded
        }); */
    })
    
}
