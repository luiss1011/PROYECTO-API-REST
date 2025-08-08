const mongoose = require('mongoose');

const tareasSchema = new mongoose.Schema({
    nombreTarea: {
        type: String,
        required: true,
        length: 50
    },
    materia:{
        type: String,
        required: true,
        length: 50
    },
    fechaEntrega: {
        type: Date,
        require: true,
    },
    prioridad: { 
        type: String, 
        enum: ['Alta', 'Media', 'Baja'], 
        default: 'Media',
        required: true
    },
    descripcion: {
        type: String, 
        length: 150,
        required: true
    },
    completada: { 
        type: Boolean, 
        default: false 
    },
    alumnoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'usuario',
        required: true
    },
    correoUsuario: {
    type: String,
    required: true
    }

});


module.exports = mongoose.model('tareas', tareasSchema);
