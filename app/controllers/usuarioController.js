const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/configuracion');

exports.registrar = async (req, res) => {
    try {
        const { nombre, correo, contrasena, rol } = req.body;
        const hash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({ nombre, correo, contrasena: hash, rol });
        await nuevoUsuario.save();

        res.status(201).json({ mensaje: 'Usuario registrado' });
    } catch (error) {
        res.status(400).json({ error: 'Error al registrar usuario' });
    }
};

exports.login = async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario._id, rol: usuario.rol }, config.SECRET_KEY, { expiresIn: '2h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error en el login' });
    }
};
