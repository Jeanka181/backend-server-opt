'use strict'


var express = require('express');
var autenticacion = require('../middlewars/autenticacion');

var hospitalController = require('../controllers/hospital');

var router = express.Router();
router.get('/hospitales', hospitalController.getHospitales);
router.post('/hospital', autenticacion.validateToken, hospitalController.saveHospitales);
router.put('/hospital/:id', autenticacion.validateToken, hospitalController.updateHospital);
router.delete('/hospital/:id', autenticacion.validateToken, hospitalController.deleteHospital);


module.exports = router;
