'use strict'

var express = require('express');
var getImgController = require('../controllers/getImagen');

var router = express.Router();
router.get('/:coleccion/:img', getImgController.obtenerImagenes);


module.exports = router;
