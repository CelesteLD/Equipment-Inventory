const express = require('express');
const router = express.Router();
const asignacionesController = require('../controllers/asignaciones.controller');

// Obtener todas las asignaciones
router.get('/', asignacionesController.obtenerAsignaciones);

// Crear nueva asignación
router.post('/', asignacionesController.crearAsignacion);

// Finalizar (desactivar) asignación
router.put('/:id', asignacionesController.finalizarAsignacion);

// Ver asignaciones de un usuario específico
router.get('/usuario/:id', asignacionesController.obtenerAsignacionesPorUsuario);

// Ver asignaciones de un equipo específico
router.get('/equipo/:id', asignacionesController.obtenerAsignacionesPorEquipo);



module.exports = router;
