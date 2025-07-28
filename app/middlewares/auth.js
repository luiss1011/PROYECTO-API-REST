const jwt = require('jsonwebtoken');
const config = require('../config/configuracion');

function verificarToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ mensaje: 'Token requerido' })

    try {
        const decoded = jwt.verify(token.replace('Bearer ', ''), config.SECRET_KEY);
        req.usuario = decoded;
        next();
    } catch (e) {
        return res.status(401).send({ mensaje: 'Token inválido', e});
    }
}

module.exports = {
    verificarToken
}