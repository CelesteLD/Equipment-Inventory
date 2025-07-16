const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware');
const { generarDocumentoUsuario } = require('../controllers/documentos.controller');

router.post('/:plantilla/:id', verificarToken, generarDocumentoUsuario);

module.exports = router;
