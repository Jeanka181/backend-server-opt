'use strict'


var express = require('express');
var usuarioController = require('../controllers/usuario');
// var loginController = require('../controllers/login');
var autenticacion = require('../middlewars/autenticacion');


var router = express.Router();
// router.post('/login', loginController.loginApp);
router.get('/usuarios', usuarioController.getUsers );
router.post('/usuario', autenticacion.validateToken, usuarioController.saveUsers );
router.put('/usuario/:id', autenticacion.validateToken, usuarioController.updateUsers );
router.delete('/usuario/:id', autenticacion.validateToken, usuarioController.deleteUsers );




module.exports = router;
