const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nombre: String,
    correo: { type: String, unique: true },
    contrasena: String,
    rol: { type: String, enum: ['admin', 'maestro', 'alumno'], default: 'alumno' }
});

module.exports = mongoose.model('Usuario', userSchema);
