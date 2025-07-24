const express = require('express');
const router = express.Router();
const { registrar, login } = require('../controllers/usuarioController');
const { verificarToken } = require('../middlewares/auth');

router.post('/registro', registrar);
router.post('/login', login);
router.get('/protegido', verificarToken, (req, res) => {
    res.json({ mensaje: 'Ruta protegida', usuario: req.usuario });
});

module.exports = router;
