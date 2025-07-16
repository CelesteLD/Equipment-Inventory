const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const asignacionesController = require('../controllers/asignaciones.controller');

// Obtener todas las asignaciones
router.get('/', verificarToken, asignacionesController.obtenerAsignaciones);

// Crear nueva asignación
router.post('/', verificarToken, asignacionesController.crearAsignacion);

// Finalizar (desactivar) asignación
router.put('/:id', verificarToken, asignacionesController.finalizarAsignacion);

// Ver asignaciones de un usuario específico
router.get('/usuario/:id', verificarToken, asignacionesController.obtenerAsignacionesPorUsuario);

// Ver asignaciones de un equipo específico
router.get('/equipo/:id', verificarToken, asignacionesController.obtenerAsignacionesPorEquipo);



module.exports = router;
