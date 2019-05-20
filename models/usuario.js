var mongoose = require('mongoose');
// installar desde npm install mongoose-unique-validator --save
var uniqueValidator = require('mongoose-unique-validator');


var Schema = mongoose.Schema;
var roles = require('./rol');


var usuarioSchema = new Schema({
    nombres: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    apellidos: {
        type: String,
        required: [true, 'El apellido es necesario']
    },
    correo: {
        type: String,
        unique: true,
        required: [true, 'El correo es necesario']
    },
    contrasena: {
        type: String,
        required: [true, 'La  contraseña es necesaria']
    },
    avatar: {
        type: String,
        required: false,
        // default: 'none.png'
    },
    rol: {
        type: String,
        required: false,
        default: 'USER_ROLE',
        enum: roles
    },
    google: {
        type: Boolean,
        default: false
    }
});

usuarioSchema.plugin(uniqueValidator, {
    message: 'El campo: {PATH} debe ser único... (ya existe)'
});

module.exports = mongoose.model('Usuario', usuarioSchema);
