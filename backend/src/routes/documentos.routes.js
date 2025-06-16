const express = require('express');
const router = express.Router();
const { generarDocumentoUsuario } = require('../controllers/documentos.controller');

router.post('/:plantilla/:id', generarDocumentoUsuario);

module.exports = router;
