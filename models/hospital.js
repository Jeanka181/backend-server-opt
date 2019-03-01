'use strict'

var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var hospitalSchema = new Schema({

    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    img: {
        type: String,
        required: false
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
}, {
    collection: 'hospitales' // para que mongoose lo cree automaticamente
});
module.exports = mongoose.model('Hospital', hospitalSchema);