const express = require('express');
const router = express.Router();
const equiposController = require('../controllers/equipos.controller');

// Ruta para obtener todos los equipos
router.get('/', equiposController.obtenerEquipos);
// Crear nuevo equipo
router.post('/', equiposController.crearEquipo);


module.exports = router;
