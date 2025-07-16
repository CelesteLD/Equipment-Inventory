const express = require('express');
const router = express.Router();
const verificarToken = require ('../middleware/auth.middleware')
const usuariosController = require('../controllers/usuarios.controller');

// Ruta GET para obtener todos los usuarios
router.get('/', verificarToken, usuariosController.obtenerUsuarios);
// Crear nuevo usuario
router.post('/', verificarToken, usuariosController.crearUsuario);
// Cambiar el estado de un usuario
router.put('/:id/estado', verificarToken, usuariosController.cambiarEstadoUsuario);

module.exports = router;
