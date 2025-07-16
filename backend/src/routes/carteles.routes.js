const express = require('express');
const router = express.Router();
const verificarToken = require('../middleware/auth.middleware')
const { generarCartel, generarCartelRedes } = require('../controllers/carteles.controller');

router.post('/carteles/generar', verificarToken,generarCartel);
router.post('/carteles/generar-redes', verificarToken, generarCartelRedes);

module.exports = router;
