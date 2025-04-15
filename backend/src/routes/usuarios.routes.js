const express = require('express');
const router = express.Router();
const usuariosController = require('../controllers/usuarios.controller');

// Ruta GET para obtener todos los usuarios
router.get('/', usuariosController.obtenerUsuarios);
// Crear nuevo usuario
router.post('/', usuariosController.crearUsuario);
// Cambiar el estado de un usuario
router.put('/:id/estado', usuariosController.cambiarEstadoUsuario);

module.exports = router;
