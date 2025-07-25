const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const auth = require('../middlewares/auth');

router.post('/registro', usuarioController.registrar);
router.post('/login', usuarioController.login);
router.get('/protegido', auth.verificarToken, (req, res) => {
    res.json({ mensaje: 'Ruta protegida', usuario: req.usuario });
});

module.exports = router;
