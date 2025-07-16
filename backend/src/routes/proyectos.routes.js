const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware')
const { crearProyecto, obtenerProyectos } = require('../controllers/proyectos.controller');

router.post('/', verificarToken, crearProyecto);
router.get('/', verificarToken, obtenerProyectos);

module.exports = router;
