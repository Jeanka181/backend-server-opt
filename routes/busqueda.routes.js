'use strict'

var express = require('express');
var busquedaController = require('../controllers/busqueda');

var router = express.Router();
router.get('/coleccion/:tabla/:busqueda', busquedaController.getBusquedaEspecifica)
router.get('/todo/:busqueda', busquedaController.getBusquedaBlobal);


module.exports = router;
