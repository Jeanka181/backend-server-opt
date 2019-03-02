'use strict'

var express = require('express');
var loginController = require('../controllers/login');

var router = express.Router();

// autenticacion por google api sign-in
router.post('/google', loginController.loginAppGoogle);

// autenticacion por login normal de la app
router.post('/login', loginController.loginApp);




module.exports = router;
