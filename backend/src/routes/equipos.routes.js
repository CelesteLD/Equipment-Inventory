const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const equiposController = require('../controllers/equipos.controller');

// Ruta para obtener todos los equipos
router.get('/', verificarToken, equiposController.obtenerEquipos);
// Crear nuevo equipo
router.post('/', verificarToken, equiposController.crearEquipo);
// PUT de modificación de estado
router.put('/:id', verificarToken, equiposController.actualizarEquipo);


module.exports = router;
