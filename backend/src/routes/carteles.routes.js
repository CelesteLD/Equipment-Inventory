const express = require('express');
const router = express.Router();
const { generarCartel, generarCartelRedes } = require('../controllers/carteles.controller');

router.post('/carteles/generar', generarCartel);
router.post('/carteles/generar-redes', generarCartelRedes);

module.exports = router;
