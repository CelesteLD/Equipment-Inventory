const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Ruta GET para obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);
// Crear nuevo usuario
router.post('/', usuariosController.crearUsuario);


module.exports = router;
