'use strict'


var express = require('express');
var autenticacion = require('../middlewars/autenticacion');

var medicoController = require('../controllers/medico');

var router = express.Router();
router.get('/medico', medicoController.getMedico);
router.post('/medico', autenticacion.validateToken, medicoController.saveMedico);
router.put('/medico/:id', autenticacion.validateToken, medicoController.updateMedico);
router.delete('/medico/:id', autenticacion.validateToken, medicoController.deleteMedico);


module.exports = router;
