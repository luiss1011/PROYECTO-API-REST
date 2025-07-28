const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
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
    },
    rol: { 
        enum: ['admin', 'maestro', 'alumno'],
    }
});

module.exports = mongoose.model('Usuario', userSchema);
