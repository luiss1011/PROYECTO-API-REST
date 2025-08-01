const Usuario = require('../models/usuarioModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/configuracion');


async function registrar(req, res) {
    try {
        const { nombre, correo, contrasena } = req.body;

        const verificarCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!verificarCorreo.test(correo)) {
            return res.status(400).send({ mensaje: 'El correo no tiene un formato válido' });
        }

        if (!contrasena || contrasena.length < 8) {
            return res.status(400).send({ mensaje: 'La contraseña debe tener al menos 8 caracteres' });
        }

        const usuarioExistente = await Usuario.findOne({ correo });
        if (usuarioExistente) {
            return res.status(400).send({ mensaje: 'El correo ya está registrado' });
        }

        const hash = await bcrypt.hash(contrasena, 10);

        const nuevoUsuario = new Usuario({
            nombre,
            correo,
            contrasena: hash
        });

        await nuevoUsuario.save();

        res.status(201).send({ mensaje: 'Usuario registrado' });
    } catch (e) {
        res.status(400).send({ mensaje: 'Error al registrar usuario', e });
    }
}


async function login(req, res) {
    try {
        const { correo, contrasena } = req.body;
        const usuario = await Usuario.findOne({ correo });

        if (!usuario) return res.status(404).send({ mensaje: 'Usuario no encontrado' });

        const valid = await bcrypt.compare(contrasena, usuario.contrasena);
        if (!valid) return res.status(401).send({ mensaje: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario._id, nombre: usuario.nombre, correo:usuario.correo }, config.SECRET_KEY, { expiresIn: '1h' });
        res.status(200).send({ token });
    } catch (e) {
        res.status(500).send({ mensaje: 'Error en el login', e });
    }
}  


module.exports = {
    registrar,
    login
}