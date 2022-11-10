var express = require('express');
const sequelize = require('sequelize');
const usuariosController = require('../controllers/usuarios');
var router = express.Router();

router.get('/login', usuariosController.vistaLogin);

router.post('/login', usuariosController.login);

router.post('/logout', usuariosController.logout);

module.exports = router;