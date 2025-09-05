const mongoose = require('mongoose');

const recordatoriosSchema = new mongoose.Schema({
    titulo: {
        type: String,
        required: true,
        trim: true
    },
    fechaHora: {
        type: Date,
        required: true
    },
    descripcion: {
        type: String,
        trim: true,
        default: ''
    },
    completado: {
        type: Boolean,
        default: false
    },
    correoUsuario: {
        type: String,
        required: true
    },
    fechaCreacion: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Índices para mejorar el rendimiento de las consultas
recordatoriosSchema.index({ correoUsuario: 1, fechaHora: 1 });
recordatoriosSchema.index({ correoUsuario: 1, completado: 1 });
recordatoriosSchema.index({ correoUsuario: 1, titulo: 1 });

module.exports = mongoose.model('Recordatorio', recordatoriosSchema);
