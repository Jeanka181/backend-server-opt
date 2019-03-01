'use strict'

var express = require('express');
var uploadController = require('../controllers/upload');

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart({uploadDir: './uploads/temp'});
//var multipartMiddleware = multipart();

var router = express.Router();
router.put('/upload/:coleccion/:id', multipartMiddleware ,uploadController.setLoadImage);


module.exports = router;
