const express = require('express');
const router = express.Router();
const { crearProyecto, obtenerProyectos } = require('../controllers/proyectos.controller');

router.post('/', crearProyecto);
router.get('/', obtenerProyectos);

module.exports = router;
