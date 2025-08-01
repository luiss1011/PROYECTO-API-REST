const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        length: 50
    },
    correo: { 
        type: String,
        required: true,
        lenght: 50,
        unique: true
    },
    contrasena: {
        type: String,
        required: true,
        length: 50
    }
});

module.exports = mongoose.model('usuario', usuarioSchema);
